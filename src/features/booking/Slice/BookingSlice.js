import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../api/axiosInstance";
import BookingService from "../service/BookingService";

export const lockSeats = createAsyncThunk('booking/lockSeats', async (payload, thunkAPI) => {
  try {
    return await BookingService.lockSeats(payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to lock seats');
  }
});

export const releaseSeats = createAsyncThunk('booking/releaseSeats', async (seatIds, thunkAPI) => {
  try {
    return await BookingService.releaseSeats(seatIds);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to release seats');
  }
});

export const cancelBooking = createAsyncThunk('booking/cancel', async (bookingRef, thunkAPI) => {
  try {
    return await BookingService.cancelBooking(bookingRef);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
  }
});

export const fetchMyBooking = createAsyncThunk("booking/my",async(_,thunkAPI) => {
    try{
        return await BookingService.getMyBookings();
    }catch(error){
        return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch my booking" 
      );
    }
});

export const fetchBookingsByOp = createAsyncThunk("booking/operator",async(id,thunkAPI) => {
    try{
        return await BookingService.getBookingsByOp(id);
    }catch(error){
        return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings by Operator id" 
      );
    }
});

export const fetchCancelList = createAsyncThunk("booking/cancel-list",async(_,thunkAPI) => {
  try{
      return await BookingService.cancelList();
  }catch(error){
      return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch bookings by Operator id" 
    );
  }
});

const BookingSlice = createSlice({    
    name:"booking",
    initialState:{
        list:[],
        error:null,
        loading:false,
        pendingBooking:null,
        confirmedBooking:null,

    },
    reducers:{
        clearError: (state) => {
            state.error=null
        }
    },
    extraReducers: (build) => {
        build
        .addCase(fetchMyBooking.pending, (state) => {
            state.error=null;
            state.loading=true;
        })
        .addCase(fetchMyBooking.fulfilled, (state,action) => {
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(fetchMyBooking.rejected, (state,action) => {
            state.error=action.payload;
            state.loading=false;
        })
        .addCase(lockSeats.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(lockSeats.fulfilled, (state, action) => {
          state.loading = false;
          state.pendingBooking = action.payload;
        })
        .addCase(lockSeats.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // releaseSeats
        .addCase(releaseSeats.fulfilled, (state) => {
          state.pendingBooking = null;
        })
        .addCase(cancelBooking.fulfilled, (state, action) => {
        // BEFORE: state.myBookings (undefined — not in initialState)
        state.list = state.list.map((b) =>
          b.bookingRef === action.payload.bookingRef ? action.payload : b
        );
        })
        .addCase(fetchBookingsByOp.fulfilled, (state, action) => {
          state.loading=false;
          state.list = action.payload;
        })
        .addCase(fetchBookingsByOp.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchBookingsByOp.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(fetchCancelList.fulfilled, (state, action) => {
          state.loading=false;
          state.list = action.payload;
        })
        .addCase(fetchCancelList.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchCancelList.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
    }
})

export const { clearError } = BookingSlice.actions;
export default BookingSlice.reducer;