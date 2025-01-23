import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedUserTypes }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if user is not logged in
  }

  if (!allowedUserTypes.includes(user.userType)) {
    return <Navigate to="/" />; // Redirect to home if user type is not allowed
  }

  return <Outlet />; // Render the child routes if user is authorized
};

export default ProtectedRoute;