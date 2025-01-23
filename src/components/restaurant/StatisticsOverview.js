import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from '../../styles/RestaurantDashboard.module.css';
import { motion } from 'framer-motion';

const StatisticsOverview = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Step 1: Fetch all food listings created by the restaurant
        const listingsResponse = await api.get('/api/food-listings/restaurant');
        const listings = listingsResponse.data;
    
        // Step 2: Extract listing IDs
        const listingIds = listings.map((listing) => listing._id);
    
        // Step 3: Fetch reservations for these listing IDs
        const reservationsResponse = await api.get('/api/reservations/by-listings', {
          params: { listingIds: listingIds.join(',') },
        });
        const reservations = reservationsResponse.data;
    
        // Step 4: Calculate statistics
        const totalListings = listings.length;
        const activeListings = listings.filter((listing) => listing.status === 'available').length;
        const completedReservations = reservations.filter(
          (reservation) => reservation.pickupStatus === 'picked_up'
        ).length;
    
        // Step 5: Set statistics in state
        setStats({
          total: totalListings,
          active: activeListings,
          completed: completedReservations,
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={styles.stats}>
      <motion.div
        className={styles.statCard}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
      >
        <h3>Total Listings</h3>
        <p>{stats.total}</p>
      </motion.div>
      <motion.div
        className={styles.statCard}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
      >
        <h3>Active Listings</h3>
        <p>{stats.active}</p>
      </motion.div>
      <motion.div
        className={styles.statCard}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
      >
        <h3>Completed Reservations</h3>
        <p>{stats.completed}</p>
      </motion.div>
    </div>
  );
};

export default StatisticsOverview;