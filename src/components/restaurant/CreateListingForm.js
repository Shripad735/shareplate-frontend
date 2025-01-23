import React, { useState } from 'react';
import api from '../../services/api';
import styles from '../../styles/RestaurantDashboard.module.css';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const CreateListingForm = () => {
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    expiryTime: '',
    location: '',
    photo: '',
  });

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        const base64File = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

        const uploadResponse = await api.post('/api/upload-image', { file: base64File });
        imageUrl = uploadResponse.data.imageUrl;
      }

      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          formData.location
        )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );

      if (geocodeResponse.data.status === 'OK') {
        const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
        const locationObject = {
          address: formData.location,
          coordinates: [lat, lng],
        };

        const response = await api.post('/api/food-listings/', {
          ...formData,
          location: locationObject,
          photo: imageUrl,
        });

        enqueueSnackbar('Listing created successfully!', { variant: 'success' });
      } else {
        enqueueSnackbar('Unable to find the location. Please check the address.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('An error occurred while creating the listing.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={styles.form}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Create New Listing</h2>
      <motion.div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Food Type"
          value={formData.foodType}
          onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
          className={styles.inputField}
        />
      </motion.div>
      <motion.div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className={styles.inputField}
        />
      </motion.div>
      <motion.div className={styles.formGroup}>
        <input
          type="datetime-local"
          value={formData.expiryTime}
          onChange={(e) => setFormData({ ...formData, expiryTime: e.target.value })}
          className={styles.inputField}
        />
      </motion.div>
      <motion.div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Location Address"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className={styles.inputField}
        />
      </motion.div>
      <motion.div className={styles.formGroup}>
        <input
          type="file"
          onChange={handleFileChange}
          className={styles.inputField}
          accept="image/*"
        />
      </motion.div>
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {loading ? 'Creating Listing...' : 'Create Listing'}
      </motion.button>
    </motion.form>
  );
};

export default CreateListingForm;