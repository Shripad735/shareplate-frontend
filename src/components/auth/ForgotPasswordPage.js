import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import styles from '../../styles/ForgotPasswordPage.module.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Enter new password
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSendOTP = async () => {
    try {
      // const response = await fetch('http://localhost:9000/api/auth/forgot-password', {
        const response = await fetch('https://shareplate-backend-ckyoa0709-shripad-khandares-projects.vercel.app/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar('OTP sent to your email. Please check your inbox and spam folder.', { variant: 'success' });
        setStep(2);
      } else {
        enqueueSnackbar(data.message || 'Failed to send OTP', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Network error. Please try again.', { variant: 'error' });
    }
  };

  const handleValidateOTP = async () => {
    try {
      // const response = await fetch('http://localhost:9000/api/auth/validate-otp', {
        const response = await fetch('https://shareplate-backend-ckyoa0709-shripad-khandares-projects.vercel.app/api/auth/validate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar('OTP validated successfully', { variant: 'success' });
        setStep(3);
      } else {
        enqueueSnackbar(data.message || 'Invalid OTP', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Network error. Please try again.', { variant: 'error' });
    }
  };

  const handleResetPassword = async () => {
    try {
      // const response = await fetch('http://localhost:9000/api/auth/reset-password', {
        const response = await fetch('https://shareplate-backend-ckyoa0709-shripad-khandares-projects.vercel.app/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar('Password reset successfully', { variant: 'success' });
        navigate('/login');
      } else {
        enqueueSnackbar(data.message || 'Failed to reset password', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Network error. Please try again.', { variant: 'error' });
    }
  };

  return (
    <div className={styles.forgotPasswordBody}>
      <div className={styles.forgotPasswordContainer}>
        <h2>Forgot Password</h2>
        {step === 1 && (
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="button" className={styles.primaryBtn} onClick={handleSendOTP}>
              Send OTP
            </button>
          </div>
        )}
        {step === 2 && (
          <div className={styles.formGroup}>
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="button" className={styles.primaryBtn} onClick={handleValidateOTP}>
              Validate OTP
            </button>
          </div>
        )}
        {step === 3 && (
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="button" className={styles.primaryBtn} onClick={handleResetPassword}>
              Reset Password
            </button>
          </div>
        )}
        <p className={styles.loginLink}>
          Remember your password? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;