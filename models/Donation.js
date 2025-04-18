/* server/models/Donation.js */
const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Please provide a scheduled date']
  },
  bloodType: {
    type: String,
    required: [true, 'Please provide blood type'],
    uppercase: true,
    trim: true,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not a valid blood type'
    }
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['Pending', 'Completed', 'Cancelled'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Pending'
  },
  completedDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);
