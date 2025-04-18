/* client/src/components/PrivateRoute.js */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * A component that wraps protected routes.
 * Checks if a user is authenticated based on the Redux state.
 * If authenticated, renders the child route's component (via <Outlet />).
 * If not authenticated, redirects the user to the login page.
 *
 * Note: This basic version only checks for login status. For role-based
 * authorization, you would add checks for user.role here or create
 * separate authorization components/hooks.
 */
const PrivateRoute = () => {
  // Get user authentication status from Redux store
  const { user } = useSelector((state) => state.auth);

  // If user exists (is logged in), render the nested child route component
  // <Outlet /> is a placeholder provided by react-router-dom for the child route's element
  // If user does not exist, redirect to the login page
  // 'replace' prop prevents adding the login page to the history stack,
  // so the user doesn't go back to the login page after logging in.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
