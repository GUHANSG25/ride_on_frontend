import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../api/axiosInstance'
import TripService from '../service/tripService';

export const fetchTrip = createAsyncThunk("trip/fetchAll", async (_, thunkAPI) => {
  try {
   return await TripService.getAll(); 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch routes");
  }
});

export const saveTrip = createAsyncThunk("trip/save", async (tripData, thunkAPI) => {
  try {
    return await TripService.save(tripData); 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch routes");
  }
});

export const searchTrip = createAsyncThunk("trip/search", async ({ source, destination, date }, thunkAPI) => {
  try {
    return await TripService.search(source, destination, date);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch trips");
  }
});


const tripSlice = createSlice({
  name: "trip",
  initialState: {
    list: [],
    trips: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrip.pending,(state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchTrip.fulfilled,(state, action) => { 
        state.loading = false; 
        state.list = action.payload;
      })
      .addCase(fetchTrip.rejected,(state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      })
      .addCase(saveTrip.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(saveTrip.fulfilled, (state,action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(saveTrip.rejected, (state,action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(searchTrip.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(searchTrip.fulfilled, (state,action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(searchTrip.rejected, (state,action) => {
        state.error = action.payload;
        state.loading = false;
      })
    }
})

export const { clearError } = tripSlice.actions;
export default tripSlice.reducer;