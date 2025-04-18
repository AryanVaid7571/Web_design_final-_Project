/* client/src/features/requests/requestSlice.js */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import requestService from '../../services/requestService';

// Get all requests (for hospital staff)
export const getAllRequests = createAsyncThunk(
  'requests/getAll',
  async (_, thunkAPI) => {
    try {
      return await requestService.getAllRequests();
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user's requests (for recipients)
export const getMyRequests = createAsyncThunk(
  'requests/getMy',
  async (_, thunkAPI) => {
    try {
      return await requestService.getMyRequests();
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new request
export const createRequest = createAsyncThunk(
  'requests/create',
  async (requestData, thunkAPI) => {
    try {
      return await requestService.createRequest(requestData);
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update request status
export const updateRequestStatus = createAsyncThunk(
  'requests/updateStatus',
  async ({ requestId, status }, thunkAPI) => {
    try {
      return await requestService.updateRequestStatus(requestId, status);
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  requests: [],
  myRequests: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all requests
      .addCase(getAllRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.requests = action.payload;
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get my requests
      .addCase(getMyRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myRequests = action.payload;
      })
      .addCase(getMyRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create request
      .addCase(createRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myRequests.push(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update request status
      .addCase(updateRequestStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Request status updated successfully';
        state.requests = state.requests.map(request =>
          request._id === action.payload._id ? action.payload : request
        );
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = requestSlice.actions;
export default requestSlice.reducer;
