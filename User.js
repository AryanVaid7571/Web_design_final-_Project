/* server/models/User.js */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

// Define the schema for the User collection
const userSchema = mongoose.Schema(
  {
    // Basic user information
    name: {
      type: String,
      required: [true, 'Please add a name'], // Name is required
      trim: true, // Remove leading/trailing whitespace
    },
    email: {
      type: String,
      required: [true, 'Please add an email'], // Email is required
      unique: true, // Ensure emails are unique in the database
      lowercase: true, // Store emails in lowercase for consistency
      trim: true,
      match: [ // Basic regex for email format validation
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'], // Password is required
      minlength: [6, 'Password must be at least 6 characters long'], // Enforce minimum password length
      select: false, // Prevent password from being returned by default in queries
    },
    // Role definition based on project requirements
    role: {
      type: String,
      required: true,
      enum: { // Define the allowed roles explicitly
        values: ['donor', 'recipient', 'hospital_staff', 'admin'],
        message: '{VALUE} is not a supported role' // Custom error message
      },
      default: 'donor', // Set a default role if none is provided during creation
    },
    // Additional fields (customize based on your needs)
    phoneNumber: {
      type: String,
      trim: true,
      // Add validation if needed (e.g., regex for phone format)
    },
    // Fields specific to certain roles (consider if a separate Profile model is better)
    // Example for donor:
    bloodType: {
      type: String,
      trim: true,
      uppercase: true,
      // Example validation using enum for blood types
      // enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    lastDonationDate: {
      type: Date,
    },
    // Example for hospital staff:
    hospitalName: {
        type: String,
        trim: true,
    },
    hospitalId: { // Could link to a separate Hospital collection if needed
        type: String,
        trim: true,
    },
    // Address (can be an object for more structure)
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
    },
    isActive: { // Useful for enabling/disabling accounts instead of deleting
        type: Boolean,
        default: true,
    }
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// --- Mongoose Middleware ---

// Middleware to run BEFORE a user document is saved ('save' hook)
userSchema.pre('save', async function (next) {
  // 'this' refers to the document being saved

  // Only hash the password if it has been modified (or is new)
  // This prevents re-hashing the password every time the user document is saved
  if (!this.isModified('password')) {
    return next(); // Skip hashing if password isn't changed
  }

  try {
    // Generate a salt (random data used in hashing) - 10 rounds is generally recommended
    const salt = await bcrypt.genSalt(10);
    // Hash the plain text password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Proceed with saving the document
  } catch (error) {
    next(error); // Pass any error during hashing to the next middleware/error handler
  }
});

// --- Mongoose Instance Methods ---

// Method to compare an entered password with the stored hashed password
// We define this on the 'methods' property of the schema
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this' refers to the specific user document instance
  // 'this.password' is the hashed password stored in the database for this user
  // Note: Since password has `select: false`, we need to ensure it was selected
  // in the query that fetched this user document if we need to access it directly here.
  // However, bcrypt.compare handles fetching if needed implicitly in some contexts,
  // but it's safer to assume the password field might not be present on `this` here.
  // A better approach is often to find the user again with the password selected,
  // as done in the authController example. Let's keep this simpler for the model:
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw error; // Re-throw error for handling elsewhere
  }
  // Important: For this method to work reliably on an instance where password
  // wasn't explicitly selected, you'd typically call it like:
  // const user = await User.findById(userId).select('+password');
  // const isMatch = await user.matchPassword(plainPassword);
};


// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
