import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import TripService from '../service/tripService';

export const fetchTrip = createAsyncThunk('trip/fetchAll', async (_, thunkAPI) => {
  try {
    return await TripService.getAll();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch trips');
  }
});

export const saveTrip = createAsyncThunk('trip/save', async (tripData, thunkAPI) => {
  try {
    return await TripService.save(tripData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to save trip');
  }
});

export const searchTrip = createAsyncThunk('trip/search', async ({ source, destination, date }, thunkAPI) => {
  try {
    return await TripService.search(source, destination, date);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to search trips');
  }
});

// Fetches seat layout for SelectSeats page
export const fetchSeats = createAsyncThunk('trip/fetchSeats', async (tripId, thunkAPI) => {
  try {
    return await TripService.getSeats(tripId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch seats');
  }
});

export const fetchPoints = createAsyncThunk('trip/fetchPoints', async (tripId, thunkAPI) => {
  try {
    return await TripService.getPoints(tripId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch seats');
  }
});

const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    list: [],
    trips: [],
    seats: [],  
    points: [],
    loading: false,
    seatsLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSeats:  (state) => { state.seats = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrip.pending,  (state) => { 
        state.loading = true;  state.error = null; 
      })
      .addCase(fetchTrip.fulfilled,(state, action) => { 
        state.loading = false; state.list = action.payload; 
      })
      .addCase(fetchTrip.rejected, (state, action) => {
         state.loading = false; state.error = action.payload; 
      })

      .addCase(saveTrip.pending,  (state) => { 
        state.loading = true;  state.error = null;
      })
      .addCase(saveTrip.fulfilled,(state, action) => { 
        state.loading = false; state.list.push(action.payload); 
      })
      .addCase(saveTrip.rejected, (state, action) => { 
        state.loading = false; state.error = action.payload; 
      })

      .addCase(searchTrip.pending,  (state) => { 
        state.loading = true;  state.error = null; 
      })
      .addCase(searchTrip.fulfilled,(state, action) => { 
        state.loading = false; state.trips = action.payload; 
      })
      .addCase(searchTrip.rejected, (state, action) => { 
        state.loading = false; state.error = action.payload; 
      })

      .addCase(fetchSeats.pending,  (state) => { 
        state.seatsLoading = true;  state.error = null; 
      })
      .addCase(fetchSeats.fulfilled,(state, action) => { 
        state.seatsLoading = false; state.seats = action.payload; 
      })
      .addCase(fetchSeats.rejected, (state, action) => { 
        state.seatsLoading = false; state.error = action.payload; 
      })

      .addCase(fetchPoints.pending,  (state) => { 
        state.loading = true;  state.error = null; 
      })
      .addCase(fetchPoints.fulfilled,(state, action) => {
         state.loading = false; state.points = action.payload; 
      })
      .addCase(fetchPoints.rejected, (state, action) => { 
        state.loading = false; state.error = action.payload; 
      });
  },
});

export const { clearError, clearSeats } = tripSlice.actions;
export default tripSlice.reducer;
