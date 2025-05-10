/* client/src/features/admin/userListSlice.js */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService'; // Import the user service

// --- Initial State ---
const initialState = {
  users: [], // Array to hold the list of users
  isLoading: false,
  isError: false,
  message: '',
};

// --- Async Thunks ---

// Async thunk for fetching all users (Admin only)
export const fetchUsers = createAsyncThunk(
  'admin/userList/fetchAll', // Action type prefix
  async (_, thunkAPI) => { // No arguments needed from component dispatch
    try {
      // The userService.getAllUsers function will handle getting the token
      // from localStorage and including it in the request header.
      // Ensure the logged-in user (whose token is in localStorage) is an admin.
      return await userService.getAllUsers();
    } catch (error) {
      // Extract meaningful error message
      const message =
        error || 'Failed to fetch users'; // Use error message directly if thrown by service
      // Handle potential authorization errors specifically
      if (message === 'Not authorized, no token' || error?.response?.status === 401 || error?.response?.status === 403) {
          // Optionally dispatch logout if token is invalid/forbidden
          // thunkAPI.dispatch(logout()); // Assuming logout is imported or accessible
          return thunkAPI.rejectWithValue('Unauthorized: Admin access required.');
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Slice Definition ---
export const userListSlice = createSlice({
  name: 'userList', // Name of the slice
  initialState,
  // No synchronous reducers needed for just fetching list initially
  reducers: {
    resetUserListState: (state) => initialState, // Optional: action to reset state
  },
  // Handle async thunk lifecycle actions
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false; // Reset error on new fetch attempt
        state.message = '';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload; // Store the fetched user list in state
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // Store the error message
        state.users = []; // Clear users array on error
      });
  },
});

// Export any synchronous actions if defined (optional)
export const { resetUserListState } = userListSlice.actions;

// Export the reducer function for the store
export default userListSlice.reducer;
