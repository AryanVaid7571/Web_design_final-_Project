/* server/controllers/donationController.js */
const asyncHandler = require('express-async-handler');
const Donation = require('../models/Donation');

// Create a new donation
const createDonation = asyncHandler(async (req, res) => {
  const { scheduledDate, bloodType } = req.body;

  // Validate input
  if (!scheduledDate || !bloodType) {
    res.status(400);
    throw new Error('Please provide scheduled date and blood type');
  }

  // Validate blood type
  const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  if (!validBloodTypes.includes(bloodType)) {
    res.status(400);
    throw new Error('Invalid blood type');
  }

  // Create donation
  const donation = await Donation.create({
    donor: req.user._id,
    scheduledDate,
    bloodType,
    status: 'Pending'
  });

  res.status(201).json(donation);
});

// Get my donations
const getMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ donor: req.user._id })
    .sort({ scheduledDate: -1 });
  res.json(donations);
});

// Get all donations (admin/staff only)
const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find()
    .populate('donor', 'name email')
    .sort({ scheduledDate: -1 });
  res.json(donations);
});

// Update donation status
const updateDonationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const donationId = req.params.id;

  // Validate status
  const validStatuses = ['Pending', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  // Get the donation
  const donation = await Donation.findById(donationId);
  if (!donation) {
    res.status(404);
    throw new Error('Donation not found');
  }

  // Update donation status
  donation.status = status;
  await donation.save();

  res.json(donation);
});

module.exports = {
  createDonation,
  getMyDonations,
  getAllDonations,
  updateDonationStatus
};
