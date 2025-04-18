/* client/src/components/HospitalStaffRoute.js */
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const HospitalStaffRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // If no user or not hospital staff, redirect
    if (!user || user.role !== 'hospital_staff') {
      console.log('Access denied:', { user });
      if (user) {
        dispatch(logout());
      }
      navigate('/login');
    }
  }, [user, navigate, dispatch]);

  // While checking auth, show nothing
  if (!user) {
    return null;
  }

  // If user is hospital staff, render the protected content
  return user.role === 'hospital_staff' ? children : null;
};

export default HospitalStaffRoute;
