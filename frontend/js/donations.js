// js/donations.js
const API_URL = 'http://localhost:5000/api';

// Format date to readable string
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format amount to currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Create donation card HTML
function createDonationCard(donation) {
    return `
        <div class="donation-card">
            <div class="flex justify-between items-start">
                <div>
                    <span class="category-badge ${donation.category}">${donation.category}</span>
                    <p class="mt-2 text-lg font-semibold">${formatCurrency(donation.amount)}</p>
                    ${donation.message ? `<p class="mt-1 text-gray-600">${donation.message}</p>` : ''}
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">${formatDate(donation.createdAt)}</p>
                    <p class="text-sm text-gray-600">Status: ${donation.paymentStatus}</p>
                </div>
            </div>
        </div>
    `;
}

// Load donations
async function loadDonations() {
    const token = localStorage.getItem('token');
    const donationsList = document.getElementById('donationsList');
    const totalDonatedElement = document.querySelector('.total-donated'); // Element for total donated amount
    const donationCountElement = document.querySelector('.donation-count'); // Element for donation count

    try {
        const response = await fetch(`${API_URL}/donations/my-donations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (data.success) {
            // Calculate the total amount and count of donations
            let totalAmount = data.donations.reduce((sum, donation) => sum + donation.amount, 0);
            let donationCount = data.donations.length;

            // Update total donated amount
            if (totalDonatedElement) {
                totalDonatedElement.textContent = formatCurrency(totalAmount);
            }

            // Update donation count
            if (donationCountElement) {
                donationCountElement.textContent = donationCount;
            }

            // Populate donations list with the user's donations
            donationsList.innerHTML = donationCount > 0 ? 
                data.donations.map(createDonationCard).join('') :
                '<p class="text-gray-500">No donations yet</p>';
        } else {
            donationsList.innerHTML = '<p class="text-red-500">Failed to load donations</p>';
        }
    } catch (error) {
        donationsList.innerHTML = '<p class="text-red-500">Error loading donations</p>';
    }
}


// Handle donation form submission
const donationForm = document.getElementById('donationForm');
if (donationForm) {
    donationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`${API_URL}/donations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: Number(document.getElementById('amount').value),
                    category: document.getElementById('category').value,
                    message: document.getElementById('message').value
                })
            });

            const data = await response.json();
            
            if (data.success) {
                donationForm.reset();
                loadDonations(); // Reload donations list
            } else {
                alert('Failed to create donation. Please try again.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    });
}

// Load donations on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard')) {
        loadDonations();
    }
});