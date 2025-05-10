/* client/src/services/userService.js */
import axios from 'axios';

// Define the base URL for user API endpoints
const API_URL = '/api/users/'; // Works with proxy

/**
 * Helper function to get the authentication token from localStorage.
 * @returns {string|null} The token string or null if not found.
 */
const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || null;
  } catch (error) {
    console.error("Error parsing user from localStorage in getToken", error);
    return null;
  }
};

/**
 * Creates an Axios configuration object with the Authorization header.
 * @returns {object} Axios config object with headers.
 * @throws {Error} if token is missing.
 */
const getConfig = () => {
  const token = getToken();
  if (!token) {
    // Throw an error if the token is missing for protected requests
    throw new Error('Not authorized, no token');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * Fetches the logged-in user's profile data from the backend.
 * @returns {Promise<object>} The user profile data.
 */
const getUserProfile = async () => {
  try {
    const config = getConfig(); // Get config with auth header
    const response = await axios.get(API_URL + 'profile', config);
    return response.data;
  } catch (error) {
    console.error('Get User Profile service error:', error.response?.data || error.message);
    // Re-throw the error message from backend or a generic one
    throw error.response?.data?.message || error.message || 'Failed to fetch profile';
  }
};

/**
 * Sends updated user profile data to the backend.
 * @param {object} userData - Object containing the fields to update.
 * @returns {Promise<object>} The updated user profile data from the backend.
 */
const updateUserProfile = async (userData) => {
  try {
    const config = getConfig(); // Get config with auth header
    const response = await axios.put(API_URL + 'profile', userData, config);

    // If the update is successful, update the user in localStorage as well
    if (response.data) {
        const currentUserData = JSON.parse(localStorage.getItem('user'));
        // Merge existing data with updated data, preserving the token
        // Ensure response.data doesn't accidentally contain sensitive fields not meant for localStorage
        const updatedLocalStorage = {
            ...(currentUserData || {}), // Spread existing data (handle if null)
             _id: response.data._id, // Use data from response
             name: response.data.name,
             email: response.data.email,
             role: response.data.role,
             // Add other fields returned from backend that should be in localStorage
             token: currentUserData?.token // IMPORTANT: Preserve the original token
            };
        localStorage.setItem('user', JSON.stringify(updatedLocalStorage));
    }
    return response.data;
  } catch (error) {
    console.error('Update User Profile service error:', error.response?.data || error.message);
    throw error.response?.data?.message || error.message || 'Failed to update profile';
  }
};


// --- NEW FUNCTION for Admin ---

/**
 * Fetches a list of all users from the backend (Admin only).
 * @returns {Promise<Array>} An array of user objects.
 */
const getAllUsers = async () => {
    try {
        const config = getConfig(); // Get config with auth header (needs admin token)
        const response = await axios.get(API_URL, config); // GET request to /api/users
        return response.data; // Should be an array of users
    } catch (error) {
        console.error('Get All Users service error:', error.response?.data || error.message);
        throw error.response?.data?.message || error.message || 'Failed to fetch users';
    }
};


// Export the service functions
const userService = {
  getUserProfile,
  updateUserProfile,
  getAllUsers, // <-- ADDED EXPORT
};

export default userService;
