// Auth middleware placeholder
/* server/middleware/authMiddleware.js */
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); // For handling async errors
const User = require('../models/User'); // Import User model to find user from token

/**
 * Middleware to protect routes that require authentication.
 * Verifies the JWT token from the Authorization header.
 * Attaches the authenticated user object (excluding password) to the request object (req.user).
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token string (remove 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the JWT_SECRET from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user associated with the ID in the token payload.
      // Exclude the password field from the user object returned.
      req.user = await User.findById(decoded.id).select('-password');

      // Check if user still exists (might have been deleted after token issuance)
      if (!req.user) {
         res.status(401); // Unauthorized
         throw new Error('Not authorized, user not found for this token');
      }

      // If token is valid and user exists, proceed to the next middleware/route handler
      next();
    } catch (error) {
      // Handle errors during token verification (e.g., expired, invalid signature)
      console.error(`Token verification failed: ${error.message}`.red); // Optional logging
      res.status(401); // Unauthorized
      throw new Error('Not authorized, token failed');
    }
  }

  // If no token is found in the header
  if (!token) {
    res.status(401); // Unauthorized
    throw new Error('Not authorized, no token provided');
  }
});

/**
 * Optional Middleware to authorize based on user roles.
 * Takes one or more role strings as arguments.
 * Checks if the authenticated user's role (from req.user added by 'protect' middleware)
 * is included in the allowed roles.
 *
 * Example Usage: router.get('/admin-only', protect, authorize('admin'), adminController.getData);
 *
 * @param {...string} roles - Allowed roles for accessing the route.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Assumes 'protect' middleware has already run and attached req.user
    if (!req.user) {
        // This case should technically be caught by 'protect', but good for safety
        res.status(401);
        throw new Error('Not authorized, user not found');
    }
    if (!roles.includes(req.user.role)) {
      // User's role is not in the list of allowed roles
      res.status(403); // Forbidden
      throw new Error(
        `Forbidden: User role '${req.user.role}' is not authorized to access this route. Allowed roles: ${roles.join(', ')}`
      );
    }
    // If user role is allowed, proceed to the next middleware/route handler
    next();
  };
};


// Export the middleware functions
module.exports = { protect, authorize };
