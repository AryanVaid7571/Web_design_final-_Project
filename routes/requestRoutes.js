/* server/routes/requestRoutes.js */
const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Create and get all requests
router.route('/')
  .post(protect, authorize('recipient'), createRequest)
  .get(protect, authorize('admin', 'hospital_staff'), getAllRequests);

// Get my requests
router.route('/my')
  .get(protect, getMyRequests);

// Update request status
router.route('/:id')
  .put(protect, authorize('admin', 'hospital_staff'), updateRequestStatus);

module.exports = router;
