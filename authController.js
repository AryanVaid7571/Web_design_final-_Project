/* server/controllers/authController.js */
// Using express-async-handler to simplify error handling in async functions 
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Import the User model
const generateToken = require('../utils/generateToken'); // Import JWT generator utility

// --- Controller Functions ---

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  // Destructure required fields from request body
  const { name, email, password, role, /* include other fields needed at registration */ } = req.body;

  // --- Input Validation ---
  if (!name || !email || !password || !role) {
    res.status(400); // Bad Request
    throw new Error('Please provide all required fields: name, email, password, role');
  }
  // Add more specific validation as needed (e.g., password complexity, role validity)

  // --- Check if User Exists ---
  const userExists = await User.findOne({ email: email.toLowerCase() }); // Case-insensitive email check

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error(`User with email ${email} already exists`);
  }

  // --- Create New User ---
  // Password hashing is handled by the pre-save hook in the User model
  const user = await User.create({
    name,
    email: email.toLowerCase(), // Store email consistently
    password,
    role,
    // Add any other fields passed in req.body here
    // e.g., bloodType: req.body.bloodType, hospitalName: req.body.hospitalName
  });

  // --- Respond on Success ---
  if (user) {
    // If user creation is successful, respond with user data and a JWT token
    res.status(201).json({ // 201 Created
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Generate JWT for the new user
      createdAt: user.createdAt, // Optional: include timestamp
    });
  } else {
    // If user creation failed for some reason (should be caught by validation or DB errors)
    res.status(400); // Bad Request
    throw new Error('Invalid user data received');
  }
});

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // --- Input Validation ---
  if (!email || !password) {
    res.status(400); // Bad Request
    throw new Error('Please provide both email and password');
  }

  // --- Find User ---
  // Find user by email (case-insensitive) and explicitly select the password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  // --- Validate User and Password ---
  // Check if user exists AND if the provided password matches the hashed password
  if (user && (await user.matchPassword(password))) {
    // --- Respond on Success ---
    res.status(200).json({ // 200 OK
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Generate JWT for the logged-in user
    });
  } else {
    // If user not found or password doesn't match
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private (requires token via 'protect' middleware)
 */
const getMe = asyncHandler(async (req, res) => {
  // The 'protect' middleware should have already verified the token
  // and attached the user object (without password) to req.user

  // If req.user exists, it means authentication was successful
  if (req.user) {
     // You could fetch fresh data if needed, but req.user is usually sufficient
     // const user = await User.findById(req.user.id).select('-password');
     res.status(200).json(req.user); // Return the user data attached by the middleware
  } else {
     // This case should ideally be caught by the protect middleware, but as a fallback:
     res.status(404);
     throw new Error('User not found (token valid, but user missing)');
  }

});


// Export the controller functions to be used in routes
module.exports = {
  registerUser,
  loginUser,
  getMe,
};
