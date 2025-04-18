import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import donationService from '../../services/donationService';

// Initial state
const initialState = {
  myDonations: [],
  allDonations: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  currentDonation: null
};

// Create new donation
export const createDonation = createAsyncThunk(
  'donations/create',
  async (donationData, thunkAPI) => {
    try {
      const response = await donationService.createDonation(donationData);
      return response;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to schedule donation';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get my donations
export const getMyDonations = createAsyncThunk(
  'donations/getMy',
  async (_, thunkAPI) => {
    try {
      const response = await donationService.getMyDonations();
      return response;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to fetch donations';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all donations
export const getAllDonations = createAsyncThunk(
  'donations/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await donationService.getAllDonations();
      return response;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to fetch all donations';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update donation status
export const updateDonationStatus = createAsyncThunk(
  'donations/updateStatus',
  async ({ donationId, updateData }, thunkAPI) => {
    try {
      const response = await donationService.updateDonationStatus(donationId, updateData);
      return response;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to update donation';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const donationSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearCurrentDonation: (state) => {
      state.currentDonation = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create donation
      .addCase(createDonation.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentDonation = action.payload;
        state.myDonations.push(action.payload);
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get my donations
      .addCase(getMyDonations.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getMyDonations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myDonations = action.payload;
      })
      .addCase(getMyDonations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get all donations
      .addCase(getAllDonations.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getAllDonations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allDonations = action.payload;
      })
      .addCase(getAllDonations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update donation status
      .addCase(updateDonationStatus.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(updateDonationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.myDonations.findIndex(d => d._id === action.payload._id);
        if (index !== -1) {
          state.myDonations[index] = action.payload;
        }
      })
      .addCase(updateDonationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentDonation } = donationSlice.actions;
export default donationSlice.reducer;
