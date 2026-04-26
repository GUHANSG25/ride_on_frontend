import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PaymentService from '../service/paymentService';

export const createOrder = createAsyncThunk('payment/createOrder', async (totalFare, thunkAPI) => {
  try {
    return await PaymentService.createOrder(totalFare);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create payment order');
  }
});

export const verifyAndConfirm = createAsyncThunk('payment/verifyAndConfirm', async (payload, thunkAPI) => {
  try {
    return await PaymentService.verifyAndConfirm(payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Payment verification failed');
  }
});

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    order: null,          // Razorpay order details
    confirmedBooking: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPaymentError: (state) => { state.error = null; },
    clearOrder: (state) => { state.order = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyAndConfirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAndConfirm.fulfilled, (state, action) => {
        state.loading = false;
        state.confirmedBooking = action.payload;
        state.order = null;
      })
      .addCase(verifyAndConfirm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentError, clearOrder } = paymentSlice.actions;
export default paymentSlice.reducer;