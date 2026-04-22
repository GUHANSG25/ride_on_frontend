import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../api/axiosInstance";
import BookingService from "../service/BookingService";

// export const fetchBooking = createAsyncThunk("booking/fetchAll",async(_,thunkAPI) => {
//     try{
//         const res = await axios.get("/booking");
//         return res.data;
//     }catch(error){
//         return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Failed to fetch all bookings" 
//       );
//     }
// });

export const fetchMyBooking = createAsyncThunk("booking/my",async(_,thunkAPI) => {
    try{
        return await BookingService.getMyBookings();
    }catch(error){
        return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch my booking" 
      );
    }
});

const BookingSlice = createSlice({
    name:"booking",
    initialState:{
        list:[],
        error:null,
        loading:false,
    },
    reducers:{
        clearError: (state) => {
            state.error=null
        }
    },
    extraReducers: (build) => {
        // build
        // .addCase(fetchBooking.pending, (state) => {
        //     state.error=null;
        //     state.loading=true;
        // })
        // .addCase(fetchBooking.fulfilled, (state,action) => {
        //     state.loading = false;
        //     state.list = action.payload;
        // })
        // .addCase(fetchBooking.rejected, (state,action) => {
        //     state.error=action.payload;
        //     state.loading=false;
        // })
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
    }
})

export const { clearError } = BookingSlice.actions;
export default BookingSlice.reducer;