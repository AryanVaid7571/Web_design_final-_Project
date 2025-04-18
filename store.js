/* client/src/store/store.js */
import { configureStore } from '@reduxjs/toolkit';

// Import the reducer(s) from your feature slices
import authReducer from '../features/auth/authSlice'; // Assuming this uses export default
import userListReducer from '../features/admin/userListSlice'; // Assuming this uses export default
import donationReducer from '../features/donations/donationSlice'; // Assuming this uses export default

// --- Use DEFAULT import for the request reducer again ---
import requestReducer from '../features/requests/requestSlice';

// Example: import inventoryReducer from '../features/inventory/inventorySlice';


/**
 * Configures and creates the Redux store for the application.
 * Uses configureStore from Redux Toolkit for simplified setup,
 * including combining reducers, adding middleware (like thunk),
 * and enabling Redux DevTools extension.
 */
const store = configureStore({
  // The 'reducer' field defines the structure of the Redux state.
  reducer: {
    auth: authReducer,
    userList: userListReducer,
    donations: donationReducer,
    // Use the imported default reducer here
    requests: requestReducer, // <-- Use the default import
    // inventory: inventoryReducer,
    // Add other reducers for different features as needed
  },
  // devTools: process.env.NODE_ENV !== 'production',
});

// Export the configured store (as default)
export default store;
