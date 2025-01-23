import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import styles from '../../styles/LoginPage.module.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true); // Set loading state to true

    try {
      // const response = await fetch('http://localhost:9000/api/auth/login', {
        const response = await fetch('https://shareplate-backend-ckyoa0709-shripad-khandares-projects.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar('Login successful!', { variant: 'success' });

        // Store user data in local storage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on userType
        if (data.user.userType === 'restaurant') {
          navigate('/dashboard'); // Redirect to restaurant dashboard
        } else if (data.user.userType === 'user') {
          navigate('/user-dashboard'); // Redirect to user/NGO dashboard
        } else if (data.user.userType === 'admin') {
          navigate('/admin-dashboard'); // Redirect to admin dashboard
        }
      } else {
        enqueueSnackbar(data.message || 'Invalid credentials', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Network error. Please try again.', { variant: 'error' });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className={styles.loginBody}>
      <div className={styles.loginContainer}>
        <h2>Log In to Your Account</h2>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        <p className={styles.registerLink}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p className={styles.forgotPasswordLink}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;