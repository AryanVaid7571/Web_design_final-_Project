/* server/routes/authRoutes.js */
const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/authController'); // Import controller functions
const { protect } = require('../middleware/authMiddleware'); // Import 'protect' middleware

// Create a new Express Router instance
const router = express.Router();

// --- Define Authentication Routes ---

// Route for user registration
// Maps POST requests to /api/auth/register to the registerUser controller function
router.post('/register', registerUser);

// Route for user login
// Maps POST requests to /api/auth/login to the loginUser controller function
router.post('/login', loginUser);

// Route to get the profile of the currently logged-in user
// Maps GET requests to /api/auth/me to the getMe controller function
// The 'protect' middleware runs first to ensure the user is authenticated
router.get('/me', protect, getMe);

// You can add other auth-related routes here if needed (e.g., password reset)

// Export the router to be used in server.js
module.exports = router;
