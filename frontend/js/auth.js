//const API_URL = 'http://localhost:5000/api';

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token && window.location.pathname.includes('dashboard')) {
        // Set user name in dashboard
        const user = JSON.parse(localStorage.getItem('user'));
        const userNameElement = document.getElementById('userName');
        if (userNameElement && user) {
            userNameElement.textContent = `Welcome, ${user.name}`;
        }
        return;
    } else if (token && !window.location.pathname.includes('dashboard')) {
        window.location.href = 'pages/dashboard.html'; 
    } else if (!token && window.location.pathname.includes('dashboard')) {
        window.location.href = '/index.html';
    }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', checkAuth);

// Handle login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('error-message');
        
        try {
            const response = await fetch(`http://localhost:5000/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                })
            });

            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/frontend/pages/dashboard.html';
            } else {
                errorDiv.textContent = data.message || 'Login failed';
                errorDiv.classList.remove('hidden');
            }
        } catch (error) {
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.classList.remove('hidden');
        }
    });
}

// Handle registration form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('error-message');
        
        try {
            const response = await fetch(`http://localhost:5000/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                })
            });

            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/frontend/pages/dashboard.html';
            } else {
                errorDiv.textContent = data.message || 'Registration failed';
                errorDiv.classList.remove('hidden');
            }
        } catch (error) {
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.classList.remove('hidden');
        }
    });
}

// Handle logout
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log("Logout button clicked"); // Debugging line
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../index.html';
        });
    } else {
        console.error("Logout button not found");
    }
});

