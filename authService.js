/* client/src/services/authService.js */
import axios from 'axios'; // Import axios for making HTTP requests

// Define the base URL for authentication API endpoints
// Uses the relative path which works with the proxy setup in package.json during development
const API_URL = '/api/auth/';
// Alternatively, use the environment variable if you prefer:
// const API_URL = process.env.REACT_APP_API_URL + '/auth/';

/**
 * Sends registration data to the backend API.
 * Stores user data (including token) in localStorage upon success.
 * @param {object} userData - Object containing name, email, password, role, etc.
 * @returns {Promise<object>} - The user data returned from the API.
 */
const register = async (userData) => {
  try {
    // Make a POST request to the registration endpoint
    const response = await axios.post(API_URL + 'register', userData);

    // If the response contains user data (including token)
    if (response.data) {
      // Store the user data (which includes the token) in browser's localStorage
      // localStorage persists even after the browser tab is closed
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    // Return the data received from the backend
    return response.data;
  } catch (error) {
    // Log the error and re-throw it for handling in the Redux slice
    console.error('Registration service error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Registration failed');
  }
};

/**
 * Sends login credentials to the backend API.
 * Stores user data (including token) in localStorage upon success.
 * @param {object} userData - Object containing email and password.
 * @returns {Promise<object>} - The user data returned from the API.
 */
const login = async (userData) => {
  try {
    // Make a POST request to the login endpoint
    const response = await axios.post(API_URL + 'login', userData);

    // If the response contains user data (including token)
    if (response.data) {
      // Store the user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    // Return the data received from the backend
    return response.data;
  } catch (error) {
     // Log the error and re-throw it
    console.error('Login service error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Login failed');
  }
};

/**
 * Removes user data from localStorage (simulates logout).
 */
const logout = () => {
  localStorage.removeItem('user');
  // Optionally: could make an API call here if the backend needs to invalidate the token server-side
};

// You can add other auth-related API functions here later, e.g., forgotPassword, resetPassword

// Export the functions as an object
const authService = {
  register,
  login,
  logout,
};

export default authService;
