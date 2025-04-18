import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

// Get all users
export const getUsers = createAsyncThunk(
  'users/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await userService.getUsers();
      return response;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user role
export const updateUserRole = createAsyncThunk(
  'users/updateRole',
  async (userData, thunkAPI) => {
    try {
      const response = await userService.updateUserRole(userData);
      return response;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (userId, thunkAPI) => {
    try {
      await userService.deleteUser(userId);
      return userId;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.users = [];
      })
      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
