/* server/middleware/errorMiddleware.js */

// Handle 404 errors
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Handle all other errors
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err.message);

  // Get status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Send error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };