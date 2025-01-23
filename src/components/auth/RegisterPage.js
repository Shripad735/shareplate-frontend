import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import styles from '../../styles/RegisterPage.module.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'restaurant',
    name: '',
    phone: '',
    address: '',
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [passwordError, setPasswordError] = useState(''); // State to store password validation error message

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate password if the field is being changed
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      setPasswordError('Password must be at least 8 characters long.');
    } else if (!hasUpperCase) {
      setPasswordError('Password must contain at least one uppercase letter.');
    } else if (!hasLowerCase) {
      setPasswordError('Password must contain at least one lowercase letter.');
    } else if (!hasDigit) {
      setPasswordError('Password must contain at least one digit.');
    } else if (!hasSpecialChar) {
      setPasswordError('Password must contain at least one special character.');
    } else {
      setPasswordError(''); // Clear error if password is valid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any password validation errors
    if (passwordError) {
      enqueueSnackbar(passwordError, { variant: 'error' });
      return;
    }

    try {
      // const response = await fetch('http://localhost:9000/api/auth/register', {
        const response = await fetch('https://shareplate-backend-ckyoa0709-shripad-khandares-projects.vercel.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar('Registration successful!', { variant: 'success' });
        navigate('/login');
      } else {
        enqueueSnackbar(data.message || 'Registration failed', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  return (
    <div className={styles.RegisterBody}>
      <div className={styles.registerContainer}>
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
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
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {passwordError && <p style={{ color: 'red', fontSize: '0.8rem' }}>{passwordError}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="userType">User Type</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="restaurant">Restaurant</option>
              <option value="user">Individual/NGO</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.primaryBtn}>
            Register
          </button>
        </form>
        <p className={styles.loginLink}>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;