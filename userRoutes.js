/* server/routes/userRoutes.js */
const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers, // <-- Import added 
  // Add other user-related controller functions here later if needed
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Import middleware

const router = express.Router();

// --- Define User Routes ---

// Route to get and update the logged-in user's profile
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// --- Admin-only Routes ---

// Route for Admin to get all users
// protect ensures user is logged in
// authorize('admin') ensures the logged-in user has the 'admin' role
router.route('/')
  .get(protect, authorize('admin'), getAllUsers); // <-- Route added

// --- Example Admin-only Routes for specific user by ID (Implement later if needed) ---
// router.route('/:id')
//   .get(protect, authorize('admin'), getUserById)
//   .put(protect, authorize('admin'), updateUserById)
//   .delete(protect, authorize('admin'), deleteUser);


// Export the router
module.exports = router;
