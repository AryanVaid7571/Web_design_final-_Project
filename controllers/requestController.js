/* server/controllers/requestController.js */
const asyncHandler = require('express-async-handler');
const Request = require('../models/Request');

// Create a new blood request
const createRequest = asyncHandler(async (req, res) => {
  const { bloodType, quantity, urgency, reason } = req.body;

  // Validate required fields
  if (!bloodType || !quantity) {
    res.status(400);
    throw new Error('Blood type and quantity are required');
  }

  // Validate blood type
  const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  if (!validBloodTypes.includes(bloodType)) {
    res.status(400);
    throw new Error('Invalid blood type');
  }

  // Validate quantity
  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1 unit');
  }

  // Create request
  const request = await Request.create({
    recipient: req.user._id,
    bloodType,
    quantity,
    urgency: urgency || 'Medium',
    reason: reason || '',
    status: 'Pending'
  });

  res.status(201).json(request);
});

// Get logged-in user's requests
const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ recipient: req.user._id })
    .sort('-createdAt');
  res.json(requests);
});

// Get all requests (admin/staff only)
const getAllRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find()
    .populate('recipient', 'name email')
    .sort('-createdAt');
  res.json(requests);
});

// Update request status
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const requestId = req.params.id;

  // Validate status
  const validStatuses = ['Pending', 'Approved', 'Fulfilled', 'Rejected', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  // Get the request
  const request = await Request.findById(requestId);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  // Update request status
  request.status = status;
  await request.save();

  res.json(request);
});

module.exports = {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus
};
