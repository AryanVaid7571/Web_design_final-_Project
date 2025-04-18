/* client/src/services/donationService.js */
import axios from 'axios';
import api from './api';

// Define the base URL for donation API endpoints
const API_URL = '/api/donations'; // Works with proxy

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
    throw new Error('Not authorized, no token');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      // Content-Type will often be application/json, axios handles this for data objects
    },
  };
};

/**
 * Sends data to create a new donation record (e.g., schedule donation).
 * Requires authentication token.
 * @param {object} donationData - Object containing donation details (donationDate, bloodType, hospital?, notes?).
 * @returns {Promise<object>} The created donation record from the backend.
 */
const createDonation = async (donationData) => {
  try {
    console.log('Creating new donation...');
    const response = await api.post(API_URL, donationData, getConfig());
    console.log('Donation created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating donation:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches the donation history for the currently logged-in user.
 * Requires authentication token.
 * @returns {Promise<Array>} An array of the user's donation records.
 */
const getMyDonations = async () => {
  try {
    console.log('Fetching my donations...');
    const response = await api.get(`${API_URL}/my`, getConfig());
    console.log('My donations:', response.data);
    return response.data; // Should be an array of donations
  } catch (error) {
    console.error('Error fetching my donations:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches all donation records (Admin/Hospital Staff only).
 * Requires authentication token with appropriate role.
 * @returns {Promise<Array>} An array of all donation records.
 */
const getAllDonations = async () => {
  try {
    console.log('Fetching all donations...');
    const response = await api.get(API_URL, getConfig());
    console.log('All donations:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all donations:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Updates the status of a specific donation record (Admin/Hospital Staff only).
 * Requires authentication token with appropriate role.
 * @param {string} donationId - The ID of the donation to update.
 * @param {object} updateData - Object containing the fields to update (e.g., { status: 'Completed', quantity: 1 }).
 * @returns {Promise<object>} The updated donation record.
 */
const updateDonationStatus = async (donationId, updateData) => {
  try {
    console.log('Updating donation status...');
    const response = await api.put(`${API_URL}/${donationId}`, updateData, getConfig());
    console.log('Donation status updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating donation status:', error.response?.data || error.message);
    throw error;
  }
};

// Export the service functions
const donationService = {
  createDonation,
  getMyDonations,
  getAllDonations,
  updateDonationStatus
};

export default donationService;
