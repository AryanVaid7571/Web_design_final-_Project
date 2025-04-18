/* server/models/Request.js */
const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  bloodType: {
    type: String,
    required: [true, 'Blood type is required'],
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not a valid blood type'
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1 unit']
  },
  urgency: {
    type: String,
    required: true,
    enum: {
      values: ['Low', 'Medium', 'High', 'Critical'],
      message: '{VALUE} is not a valid urgency level'
    },
    default: 'Medium'
  },
  reason: {
    type: String,
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['Pending', 'Approved', 'Fulfilled', 'Rejected', 'Cancelled'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);
