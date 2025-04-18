/* client/src/features/auth/authSlice.js */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
// Import the user service we just created
import userService from '../../services/userService'; // <-- ADD THIS IMPORT

// --- Initial State ---
const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    localStorage.removeItem('user');
    return null;
  }
};

const initialState = {
  user: getUserFromLocalStorage(), // User object { _id, name, email, role, token, ...other profile data? } or null
  isLoading: false,
  isError: false,
  isSuccess: false, // General success flag, might need more specific flags
  message: '',
  // Optional: Add specific flags for profile actions if needed
  // isProfileLoading: false,
  // isProfileUpdateSuccess: false,
};


// --- Async Thunks (for API interactions) ---

// Register user (Keep existing)
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user (Keep existing)
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user (Keep existing)
export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout();
});

// --- NEW Async Thunks for User Profile ---

// Get user profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile', // Action type prefix
  async (_, thunkAPI) => { // No arguments needed, token is handled by service
    try {
      // Call the getUserProfile function from the userService
      // Token is automatically included by the service function
      return await userService.getUserProfile();
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      // Check specifically for authorization errors (e.g., token expired/invalid)
      if (error.response?.status === 401) {
          // Optionally dispatch logout action if token is invalid
          thunkAPI.dispatch(logout());
          return thunkAPI.rejectWithValue('Unauthorized/Session Expired. Please login again.');
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile', // Action type prefix
  async (userData, thunkAPI) => { // userData comes from the component dispatching the action
    try {
      // Call the updateUserProfile function from the userService
      // Token is automatically included by the service function
      return await userService.updateUserProfile(userData);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
       if (error.response?.status === 401) {
          thunkAPI.dispatch(logout());
          return thunkAPI.rejectWithValue('Unauthorized/Session Expired. Please login again.');
       }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Slice Definition ---
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      // Reset flags, keep user logged in if they exist
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      // state.isProfileUpdateSuccess = false; // Reset specific flags if added
    },
  },
  extraReducers: (builder) => {
    builder
      // Register lifecycle (Keep existing)
      .addCase(register.pending, (state) => { state.isLoading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.user = action.payload; state.message = 'Registration successful!';
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload; state.user = null;
      })
      // Login lifecycle (Keep existing)
      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.user = action.payload; state.message = 'Login successful!';
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload; state.user = null;
      })
      // Logout lifecycle (Keep existing)
      .addCase(logout.fulfilled, (state) => {
        state.user = null; state.message = 'Logout successful!';
      })
      // --- NEW Get User Profile Lifecycle ---
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true; // Use general loading or isProfileLoading
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update user state with potentially fresher profile data
        // Ensure token isn't overwritten if backend doesn't send it back on profile fetch
        const token = state.user?.token; // Preserve existing token
        state.user = { ...action.payload, token: token || null };
        // state.isSuccess = true; // Optionally set general success
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // Error message from thunkAPI.rejectWithValue
        // If rejected due to auth error (handled in thunk), user state might already be null via logout dispatch
      })
      // --- NEW Update User Profile Lifecycle ---
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true; // Use general loading or isProfileLoading
        // state.isProfileUpdateSuccess = false; // Reset specific flag
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true; // Indicate general success
        // state.isProfileUpdateSuccess = true; // Indicate specific success
        // Update user state with the updated profile data returned from the API
        // The service already updated localStorage, now update Redux state
        const token = state.user?.token; // Preserve existing token
        state.user = { ...action.payload, token: token || null };
        state.message = 'Profile updated successfully!'; // Set success message
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // Error message from thunkAPI.rejectWithValue
        // state.isProfileUpdateSuccess = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
