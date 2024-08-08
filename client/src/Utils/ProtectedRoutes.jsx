import React from 'react';
import { Navigate } from 'react-router-dom';
import Auth from '../libs/auth';

const ProtectedRoutes = ({ element }) => {
  const user = Auth.getCurrentUser();

  return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoutes;
