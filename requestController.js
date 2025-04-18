/* server/controllers/requestController.js */
const asyncHandler = require('express-async-handler');
const Request = require('../models/Request'); // Import Request model
// const User = require('../models/User'); // Import User if needed for extra checks

// --- Controller Functions ---

/**
 * @desc    Create a new blood request
 * @route   POST /api/requests
 * @access  Private (e.g., Recipient role)
 */
const createRequest = asyncHandler(async (req, res) => {
  // Extract data needed from the request body
  const { bloodType, quantity, reason, urgency, hospital } = req.body;

  // Get the logged-in user's ID (recipient) from the token
  const recipientId = req.user._id;

  // --- Basic Validation ---
  if (!bloodType || !quantity) {
    res.status(400);
    throw new Error('Please provide blood type and quantity');
  }
  // Optional: Check if the logged-in user actually has the 'recipient' role
  // if (req.user.role !== 'recipient') {
  //   res.status(403); // Forbidden
  //   throw new Error('User does not have permission to create a request');
  // }

  // --- Create Request Record ---
  const request = new Request({
    recipient: recipientId,
    bloodType,
    quantity,
    reason, // Optional
    urgency, // Optional
    hospital, // Optional hospital ID
    status: 'Pending', // Initial status
  });

  // Save the new request record to the database
  const createdRequest = await request.save();

  // Respond with the created request record
  res.status(201).json(createdRequest);
});


/**
 * @desc    Get all blood requests made by the logged-in user
 * @route   GET /api/requests/my
 * @access  Private (e.g., Recipient role)
 */
const getMyRequests = asyncHandler(async (req, res) => {
  // Find all requests where the 'recipient' field matches the logged-in user's ID
  const requests = await Request.find({ recipient: req.user._id })
                           .populate('hospital', 'name') // Optionally populate hospital details
                           .sort({ createdAt: -1 }); // Sort by creation date descending

  // Respond with the list of requests
  res.status(200).json(requests);
});


/**
 * @desc    Get all blood requests (for Admin/Hospital Staff)
 * @route   GET /api/requests
 * @access  Private (Admin/Hospital Staff roles)
 */
const getAllRequests = asyncHandler(async (req, res) => {
  // Fetch all requests
  // Optionally filter by status, e.g., find({ status: 'Pending' })
  const requests = await Request.find({}) // Fetch all for now
                            .populate('recipient', 'name email') // Populate recipient details
                            .populate('hospital', 'name') // Populate hospital details
                            .sort({ createdAt: -1 }); // Sort by creation date

  res.status(200).json(requests);
});


/**
 * @desc    Update request status (e.g., by Hospital Staff or Admin)
 * @route   PUT /api/requests/:id/status
 * @access  Private (Admin/Hospital Staff roles)
 */
const updateRequestStatus = asyncHandler(async (req, res) => {
    const { status, notes } = req.body; // Get new status and optional notes
    const requestId = req.params.id; // Get request ID from route parameter

    // Basic validation for allowed statuses
    const allowedStatuses = ['Pending', 'Approved', 'Fulfilled', 'Rejected', 'Cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
        res.status(400);
        throw new Error('Invalid or missing status');
    }

    const request = await Request.findById(requestId);

    if (!request) {
        res.status(404);
        throw new Error('Blood request not found');
    }

    // Update the status and potentially other fields
    request.status = status;
    if (notes !== undefined) request.notes = notes;
    // If status is 'Fulfilled', set the fulfilledDate
    if (status === 'Fulfilled') {
        request.fulfilledDate = Date.now();
        // TODO: Add logic here to decrease blood inventory based on request.quantity and request.bloodType
    } else {
        // Ensure fulfilledDate is null if status is not 'Fulfilled'
        request.fulfilledDate = null;
    }

    const updatedRequest = await request.save();
    res.status(200).json(updatedRequest);
});


// Add other controller functions as needed:
// - getRequestById
// - deleteRequest (maybe only recipient for 'Pending' or admin?)
// - updateRequestDetails (e.g., recipient updating quantity if status is 'Pending')


// Export the controller functions
module.exports = {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
  // Export other functions here
};
