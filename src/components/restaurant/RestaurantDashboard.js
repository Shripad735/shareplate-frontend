import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from '../../styles/RestaurantDashboard.module.css';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import ActiveListings from './ActiveListings';
import CreateListingForm from './CreateListingForm';
import StatisticsOverview from './StatisticsOverview';
import { useNavigate } from 'react-router-dom';

const RestaurantDashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [reservations, setReservations] = useState([]);
  const [listings, setListings] = useState([]); // Add this line
  const [activeSection, setActiveSection] = useState('reservations');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
    fetchListings(); // Call fetchListings on component mount
  }, []);

  // Fetch reservations for the restaurant
  const fetchReservations = async () => {
    try {
      const listingsResponse = await api.get(`/api/food-listings/restaurant`);
      const listings = listingsResponse.data;
      const listingIds = listings.map((listing) => listing._id);
      const reservationsResponse = await api.get(`/api/reservations/by-listings`, {
        params: { listingIds: listingIds.join(',') },
      });
      setReservations(reservationsResponse.data);
    } catch (error) {
      if(listings.length === 0) {
        enqueueSnackbar('No active listings found. Please create a listing to view reservations.', { variant: 'info' });
      } else {
      console.error('Error fetching reservations:', error);
      enqueueSnackbar('Error fetching reservations', { variant: 'error' });
      }
    }
  };

  // Fetch active listings for the restaurant
  const fetchListings = async () => {
    try {
      const response = await api.get('/api/food-listings/restaurant');
      const activeListings = response.data.filter(
        (listing) => listing.status !== 'completed' && listing.status !== 'picked_up'
      );
      setListings(activeListings); // Use setListings here
    } catch (error) {
      console.error('Error fetching listings:', error);
      enqueueSnackbar('Error fetching listings. Please try again.', { variant: 'error' });
    }
  };

  // Handle marking a reservation as picked up
  const handlePickup = async (reservationId) => {
    try {
      await api.put(`/api/reservations/${reservationId}/pickup`);
      enqueueSnackbar('Reservation marked as picked up', { variant: 'success' });
      fetchReservations(); // Refresh the reservations list
      fetchListings(); // Refresh the active listings
    } catch (error) {
      enqueueSnackbar('Error marking reservation as picked up', { variant: 'error' });
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <motion.div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Restaurant Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={styles.sidebar}>
        <button
          onClick={() => setActiveSection('reservations')}
          className={activeSection === 'reservations' ? styles.active : ''}
        >
          Reservations
        </button>
        <button
          onClick={() => setActiveSection('listings')}
          className={activeSection === 'listings' ? styles.active : ''}
        >
          Active Listings
        </button>
        <button
          onClick={() => setActiveSection('createListing')}
          className={activeSection === 'createListing' ? styles.active : ''}
        >
          Create Listing
        </button>
        <button
          onClick={() => setActiveSection('statistics')}
          className={activeSection === 'statistics' ? styles.active : ''}
        >
          Statistics
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {activeSection === 'reservations' && (
          <div className={styles.reservationsSection}>
            <h2>Reservations for Pickup</h2>
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <div key={reservation._id} className={styles.reservationCard}>
                  {reservation.listingId && (
                    <>
                      <img src={reservation.listingId.photo} alt={reservation.listingId.foodType} className={styles.listingImage} />
                      <div className={styles.listingDetails}>
                        <h3>{reservation.listingId.foodType}</h3>
                        <p><strong>Quantity:</strong> {reservation.listingId.quantity}</p>
                        <p><strong>Expiry:</strong> {new Date(reservation.listingId.expiryTime).toLocaleString()}</p>
                        <p><strong>Pickup Status:</strong> {reservation.pickupStatus}</p>
                        {reservation.pickupStatus === 'pending' && (
                          <button onClick={() => handlePickup(reservation._id)} className={styles.pickupBtn}>
                            Mark as Picked Up
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>No reservations found.</p>
            )}
          </div>
        )}

        {activeSection === 'listings' && (
          <div className={styles.listingsSection}>
            <h2>Active Listings</h2>
            <ActiveListings />
          </div>
        )}

        {activeSection === 'createListing' && (
          <div className={styles.createListingSection}>
            <h2>Create New Listing</h2>
            <CreateListingForm />
          </div>
        )}

        {activeSection === 'statistics' && (
          <div className={styles.statisticsSection}>
            <h2>Statistics Overview</h2>
            <StatisticsOverview />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RestaurantDashboard;