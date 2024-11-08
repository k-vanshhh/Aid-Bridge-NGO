const API_BASE_URL = 'http://localhost:5000/api';

// Function to update dashboard elements with data
const updateDashboard = (data) => {
  const {
    totalDonations = 0,
    userQueries = [],
    registeredUsers = [],
    donationData = [],
  } = data;

  // Update Total Donations
  const totalDonationsElement = document.getElementById('total-donations');
  totalDonationsElement.textContent = `$${totalDonations.toLocaleString()}`;

  // Update User Queries Count
  const userQueriesElement = document.getElementById('user-queries');
  userQueriesElement.textContent = userQueries.length;

  // Update Registered Users Count
  const registeredUsersElement = document.getElementById('registered-users');
  registeredUsersElement.textContent = registeredUsers.length;

  // Populate tables and charts
  updateQueryTable(userQueries);
  updateUserTable(registeredUsers);
  updateDonationChart(donationData);
};

// Function to populate the queries table
const updateQueryTable = (queries = []) => {
  const queryTableBody = document.getElementById('query-table-body');
  queryTableBody.innerHTML = '';

  if (!Array.isArray(queries)) {
    console.error("userQueries is not an array:", queries);
    return;
  }

  queries.forEach((query) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">${query.fullName}</td>
      <td class="px-6 py-4 whitespace-nowrap">${query.email}</td>
      <td class="px-6 py-4 whitespace-nowrap">${query.message}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${query.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">${query.status}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Respond</button>
      </td>
    `;
    queryTableBody.appendChild(row);
  });
};

// Function to populate the users table
const updateUserTable = (users = []) => {
  const userTableBody = document.getElementById('user-table-body');
  userTableBody.innerHTML = '';

  if (!Array.isArray(users)) {
    console.error("registeredUsers is not an array:", users);
    return;
  }

  users.forEach((user) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">${user.name}</td>
      <td class="px-6 py-4 whitespace-nowrap">${user.email}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
      </td>
    `;
    userTableBody.appendChild(row);
  });
};

// Function to populate the donation chart
const updateDonationChart = (data = []) => {
  const ctx = document.getElementById('donation-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((item) => item.month),
      datasets: [{
        label: 'Donations',
        data: data.map((item) => item.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
};

// Function to fetch data from API
const fetchData = async () => {
  const token = localStorage.getItem('token'); // Retrieve the stored token
  try {
    const [
      donationsResponse,
      queriesResponse,
      usersResponse,
    ] = await Promise.all([
      axios.get(`${API_BASE_URL}/donations/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_BASE_URL}/contact/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_BASE_URL}/users`, { // Correct endpoint to fetch all users
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    console.log('Donations Response:', donationsResponse.data);
    console.log('Queries Response:', queriesResponse.data);
    console.log('Users Response:', usersResponse.data);

    // Calculate total donations by summing up the product amounts
    const totalDonations = donationsResponse.data.donations
      ? donationsResponse.data.donations.reduce((sum, donation) => sum + (donation.product.amount || 0), 0)
      : 0;

    // Adjust the structure for dashboard data
    updateDashboard({
      totalDonations: totalDonations,
      userQueries: Array.isArray(queriesResponse.data.data) ? queriesResponse.data.data : [],
      registeredUsers: Array.isArray(usersResponse.data.users) ? usersResponse.data.users : [],
      donationData: donationsResponse.data.donations || [],
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Function to check if the user is an admin
const checkAdminAccess = () => {
  const role = localStorage.getItem('role');
  if (role !== 'admin') {
    alert("Access denied. Admins only.");
    window.location.href = '/'; // Redirect to home or login page
  }
};

// Run admin check and fetch data on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAdminAccess(); // Check admin access on page load
  fetchData(); // Only fetch data if the user is an admin
});


    // Display user role
    const displayUserRole = () => {
      const role = localStorage.getItem('role');
      const roleDisplayElement = document.getElementById('role-display');
      if (roleDisplayElement) {
        roleDisplayElement.textContent = role ? role : 'Unknown';
      }
    };

    document.addEventListener("DOMContentLoaded", displayUserRole);
