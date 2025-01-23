import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import './styles/App.css';
import LandingPage from './pages/Home';
import RegisterPage from './components/auth/RegisterPage';
import LoginPage from './components/auth/LoginPage';
import RestaurantDashboard from './components/restaurant/RestaurantDashboard';
import UserDashboard from './components/user/UserDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';


function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedUserTypes={['restaurant']} />}>
              <Route path="/dashboard" element={<RestaurantDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedUserTypes={['user']} />}>
              <Route path="/user-dashboard" element={<UserDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedUserTypes={['admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </SnackbarProvider>
  );
}

export default App;