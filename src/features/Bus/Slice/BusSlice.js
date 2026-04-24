import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BusService from "../service/BusService";

export const fetchBuses = createAsyncThunk("buses/fetchAll",async(_,thunkAPI) => {
    try{
        return await BusService.getAllBus();
    }catch(error){
        return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch operators" 
      );
    }
});

export const saveBus = createAsyncThunk("bus/save", async (busData, thunkAPI) => {
  try{
    return await BusService.saveBus(busData);
  }catch (error){
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to save bus");
  }
})

export const deactivateBus = createAsyncThunk("bus/deactive",async(id,thunkAPI) => {
    try{
        return await BusService.deactivateBus(id);
    }catch(error){
        return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete"  
      );
    }
});


export const updateBusStatus = createAsyncThunk("bus/update",async ({ id, status }, thunkAPI) => {
    try {
      return await BusService.updateBus(id,status);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update"
      );
    }
  }
);


const BusSlice = createSlice({
    name:"bus",
    initialState:{
        list:[],
        loading:false,
        error:null,
    },
    reducers:{
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (build) => {
        build
        .addCase(fetchBuses.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        .addCase(fetchBuses.fulfilled, (state,action) => {
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(fetchBuses.rejected, (state,action) => {
            state.error = action.payload;
            state.loading = false;
        })
        .addCase(saveBus.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        .addCase(saveBus.fulfilled, (state,action) => {
            state.loading = false;
            state.list.push(action.payload);
        })
        .addCase(saveBus.rejected, (state,action) => {
            state.error = action.payload;
            state.loading = false;
        })
        .addCase(deactivateBus.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        .addCase(deactivateBus.fulfilled, (state,action) => {
            state.loading = false;
            state.list = state.list.map(b => b.busId === action.payload ? { ...b, busStatus: "InActive" } : b);
        })
        .addCase(deactivateBus.rejected, (state,action) => {
            state.error = action.payload;
            state.loading = false;
        })
        .addCase(updateBusStatus.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        .addCase(updateBusStatus.fulfilled, (state, action) => {
            state.loading = false;
            // const updatedBus = action.payload;
            state.list = state.list.map(b =>b.busId === action.payload.busId ? action.payload : b
        );
        })
        .addCase(updateBusStatus.rejected, (state,action) => {
            state.error = action.payload;
            state.loading = false;
        })
    }
})

export const { clearError } = BusSlice.actions;
export default BusSlice.reducer;