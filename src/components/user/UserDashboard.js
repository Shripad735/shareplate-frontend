import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import styles from '../../styles/UserDashboard.module.css';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for logout functionality

const UserDashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [listings, setListings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const navigate = useNavigate(); // Initialize useNavigate for logout

  const userId = JSON.parse(localStorage.getItem('user'))._id;

  useEffect(() => {
    fetchListings();
    fetchReservations();
    fetchUserProfile();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await api.get('/api/food-listings/available');
      const currentTime = new Date();
      const validListings = response.data.filter(
        (listing) => new Date(listing.expiryTime) > currentTime
      );
      setListings(validListings);
    } catch (error) {
      enqueueSnackbar('Error fetching listings', { variant: 'error' });
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await api.get(`/api/reservations/user/${userId}`);
      setReservations(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching reservations', { variant: 'error' });
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/api/auth/user/${userId}`);
      setUser(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching user profile', { variant: 'error' });
    }
  };

  const handleReserve = async (listingId) => {
    try {
      await api.post('/api/reservations', { listingId, userId });
      enqueueSnackbar('Reservation successful', { variant: 'success' });
      fetchListings(); // Refresh the listings
      fetchReservations(); // Refresh the reservations
    } catch (error) {
      enqueueSnackbar('Error reserving listing', { variant: 'error' });
    }
  };

  const handleSearchLocation = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          searchLocation
        )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        setMapCenter({ lat, lng });
      } else {
        enqueueSnackbar('Location not found', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error searching location', { variant: 'error' });
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>User Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div className={styles.profileSection}>
        <h2>Your Profile</h2>
        {user && (
          <div className={styles.profileCard}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Address:</strong> {user.address}</p>
          </div>
        )}
      </div>

      <div className={styles.mapContainer}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Enter location"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
          <button onClick={handleSearchLocation}>Search</button>
        </div>
        {isLoaded && (
          <GoogleMap
            zoom={10}
            center={mapCenter}
            mapContainerClassName={styles.map}
          >
            {listings.map((listing) => (
              <Marker
                key={listing._id}
                position={{ lat: listing.location.coordinates[1], lng: listing.location.coordinates[0] }}
                onClick={() => handleReserve(listing._id)}
              />
            ))}
          </GoogleMap>
        )}
      </div>

      <div className={styles.listingsSection}>
        <h2>Available Listings</h2>
        {listings.map((listing) => (
          listing && (
            <div key={listing._id} className={styles.listingCard}>
              <img src={listing.photo || 'default-image-url'} alt={listing.foodType} className={styles.listingImage} />
              <div className={styles.listingDetails}>
                <h3>{listing.foodType}</h3>
                <p><strong>Quantity:</strong> {listing.quantity}</p>
                <p><strong>Expiry:</strong> {new Date(listing.expiryTime).toLocaleString()}</p>
                <p><strong>Location:</strong> {listing.location.address}</p>
                <button onClick={() => handleReserve(listing._id)} className={styles.reserveBtn}>
                  Reserve
                </button>
              </div>
            </div>
          )
        ))}
      </div>

      <div className={styles.reservationsSection}>
        <h2>Your Reservations</h2>
        {reservations.map((reservation) => (
          reservation.listingId && (
            <div key={reservation._id} className={styles.reservationCard}>
              <img src={reservation.listingId.photo || 'default-image-url'} alt={reservation.listingId.foodType} className={styles.listingImage} />
              <div className={styles.listingDetails}>
                <h3>{reservation.listingId.foodType}</h3>
                <p><strong>Quantity:</strong> {reservation.listingId.quantity}</p>
                <p><strong>Expiry:</strong> {new Date(reservation.listingId.expiryTime).toLocaleString()}</p>
                <p><strong>Location:</strong> {reservation.listingId.location.address}</p>
                <p><strong>Pickup Status:</strong> {reservation.pickupStatus}</p>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;