import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Bar, Pie } from 'react-chartjs-2';
import api from '../../services/api';
import styles from '../../styles/AdminDashboard.module.css';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AdminDashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('users');
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalListings: 0, totalReservations: 0 });

  // Fetch data for the dashboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const usersResponse = await api.get('/api/auth/users');
        setUsers(usersResponse.data);

        // Fetch all food listings
        const listingsResponse = await api.get('/api/food-listings');
        setListings(listingsResponse.data);

        // Fetch all reservations
        const reservationsResponse = await api.get('/api/reservations');
        setReservations(reservationsResponse.data);

        // Fetch statistics
        const statsResponse = await api.get('/api/stats');
        setStats(statsResponse.data);
      } catch (error) {
        enqueueSnackbar('Error fetching data', { variant: 'error' });
      }
    };

    fetchData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Handle deactivate user
  const handleDeactivateUser = async (userId) => {
    try {
      await api.put(`/api/auth/users/${userId}/deactivate`);
      enqueueSnackbar('User deactivated successfully', { variant: 'success' });
      // Refresh users list
      const usersResponse = await api.get('/api/auth/users');
      setUsers(usersResponse.data);
    } catch (error) {
      enqueueSnackbar('Error deactivating user', { variant: 'error' });
    }
  };

  // Handle delete listing
  const handleDeleteListing = async (listingId) => {
    try {
      await api.delete(`/api/food-listings/${listingId}`);
      enqueueSnackbar('Listing deleted successfully', { variant: 'success' });
      // Refresh listings list
      const listingsResponse = await api.get('/api/food-listings');
      setListings(listingsResponse.data);
    } catch (error) {
      enqueueSnackbar('Error deleting listing', { variant: 'error' });
    }
  };

  // Handle cancel reservation
  const handleCancelReservation = async (reservationId) => {
    try {
      await api.delete(`/api/reservations/${reservationId}`);
      enqueueSnackbar('Reservation cancelled successfully', { variant: 'success' });
      // Refresh reservations list
      const reservationsResponse = await api.get('/api/reservations');
      setReservations(reservationsResponse.data);
    } catch (error) {
      enqueueSnackbar('Error cancelling reservation', { variant: 'error' });
    }
  };

  // Data for charts
  const userTypesData = {
    labels: ['Restaurants', 'NGOs/Individuals', 'Admins'],
    datasets: [
      {
        label: 'User Types',
        data: [
          users.filter((user) => user.userType === 'restaurant').length,
          users.filter((user) => user.userType === 'user').length,
          users.filter((user) => user.userType === 'admin').length,
        ],
        backgroundColor: ['#6a11cb', '#2575fc', '#ff4d4d'],
      },
    ],
  };

  const listingStatusData = {
    labels: ['Available', 'Reserved', 'Completed'],
    datasets: [
      {
        label: 'Listing Status',
        data: [
          listings.filter((listing) => listing.status === 'available').length,
          listings.filter((listing) => listing.status === 'reserved').length,
          listings.filter((listing) => listing.status === 'completed').length,
        ],
        backgroundColor: ['#6a11cb', '#2575fc', '#ff4d4d'],
      },
    ],
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={styles.sidebar}>
        <button
          onClick={() => setActiveSection('users')}
          className={activeSection === 'users' ? styles.active : ''}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveSection('listings')}
          className={activeSection === 'listings' ? styles.active : ''}
        >
          Food Listings
        </button>
        <button
          onClick={() => setActiveSection('reservations')}
          className={activeSection === 'reservations' ? styles.active : ''}
        >
          Reservations
        </button>
        <button
          onClick={() => setActiveSection('analytics')}
          className={activeSection === 'analytics' ? styles.active : ''}
        >
          Analytics
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {activeSection === 'users' && (
          <div className={styles.usersSection}>
            <h2>User Management</h2>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.userType}</td>
                    <td>
                      <button onClick={() => handleDeactivateUser(user._id)}>Deactivate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'listings' && (
          <div className={styles.listingsSection}>
            <h2>Food Listings</h2>
            <div className={styles.listingGrid}>
              {listings.map((listing) => (
                <div key={listing._id} className={styles.listingCard}>
                  <img src={listing.photo} alt={listing.foodType} className={styles.listingImage} />
                  <h3>{listing.foodType}</h3>
                  <p><strong>Quantity:</strong> {listing.quantity}</p>
                  <p><strong>Status:</strong> {listing.status}</p>
                  <button onClick={() => handleDeleteListing(listing._id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'reservations' && (
          <div className={styles.reservationsSection}>
            <h2>Reservations</h2>
            <table className={styles.reservationTable}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Food Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {reservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td>{reservation.userId?.name || 'N/A'}</td>
                    <td>{reservation.listingId?.foodType || 'N/A'}</td>
                    <td>{reservation.pickupStatus}</td>
                    <td>
                      <button onClick={() => handleCancelReservation(reservation._id)}>Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

          {activeSection === 'analytics' && (
            <div className={styles.analyticsSection}>
              <h2>Analytics</h2>
              <div className={styles.stats}>
                <div className={styles.statCard}>
                  <h3>Total Users</h3>
                  <p>{stats.totalUsers}</p>
                </div>
                <div className={styles.statCard}>
                  <h3>Total Listings</h3>
                  <p>{stats.totalListings}</p>
                </div>
                <div className={styles.statCard}>
                  <h3>Total Reservations</h3>
                  <p>{stats.totalReservations}</p>
                </div>
              </div>

              {/* Charts */}
              <div className={styles.charts}>
                {users.length > 0 && (
                  <div className={styles.chart}>
                    <h3>User Types</h3>
                    <Pie data={userTypesData} />
                  </div>
                )}
                {listings.length > 0 && (
                  <div className={styles.chart}>
                    <h3>Listing Status</h3>
                    <Bar data={listingStatusData} />
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AdminDashboard;