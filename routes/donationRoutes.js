/* server/routes/donationRoutes.js */
const express = require('express');
const router = express.Router();
const {
  createDonation,
  getMyDonations,
  getAllDonations,
  updateDonationStatus
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Create donation (donor only)
router.post('/', protect, authorize('donor'), createDonation);

// Get all donations (hospital staff and admin)
router.get('/', protect, authorize('hospital_staff', 'admin'), getAllDonations);

// Get my donations (donor only)
router.get('/my', protect, authorize('donor'), getMyDonations);

// Update donation status (hospital staff and admin)
router.put('/:id', protect, authorize('hospital_staff', 'admin'), updateDonationStatus);

module.exports = router;
