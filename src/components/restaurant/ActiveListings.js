import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from '../../styles/RestaurantDashboard.module.css';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';

const ActiveListings = () => {
  const [listings, setListings] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchListings();
  }, []);

  // Fetch active listings for the restaurant (only available or reserved listings)
  const fetchListings = async () => {
    try {
      const response = await api.get('/api/food-listings/restaurant');
      // Filter out listings that are marked as "completed" or have a pickup status of "picked_up"
      const activeListings = response.data.filter(
        (listing) => listing.status !== 'completed' && listing.status !== 'picked_up'
      );
      setListings(activeListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      enqueueSnackbar('Error fetching listings. Please try again.', { variant: 'error' });
    }
  };

  // Handle deleting a listing
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/food-listings/${id}`);
      setListings(listings.filter((listing) => listing._id !== id));
      enqueueSnackbar('Listing deleted successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting listing:', error);
      enqueueSnackbar('An error occurred while deleting the listing.', { variant: 'error' });
    }
  };

  return (
    <div className={styles.listings}>
      <h2 className={styles.darkTitle}>Active Listings</h2>
      {listings.map((listing) => (
        <motion.div
          key={listing._id}
          className={styles.listingCard}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className={styles.listingContent}>
            {listing.photo && (
              <img src={listing.photo} alt={listing.foodType} className={styles.listingImage} />
            )}
            <div className={styles.listingInfo}>
              <h3>{listing.foodType}</h3>
              <p><strong>Quantity:</strong> {listing.quantity}</p>
              <p><strong>Expiry:</strong> {new Date(listing.expiryTime).toLocaleString()}</p>
              <motion.button
                onClick={() => handleDelete(listing._id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ActiveListings;