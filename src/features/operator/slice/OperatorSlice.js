import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../../../api/axiosInstance'
import OperatorService from '../service/OperatorService';

export const fetchOperators = createAsyncThunk("operator/fetchAll",async({page,size},thunkAPI) => {
    try{
        return await OperatorService.getAll(page,size);
    }catch(error){
        return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch operators"
        
      );
    }
});

export const saveOperator = createAsyncThunk("operator/save", async (operatorData, thunkAPI) => {
  try{
    return await OperatorService.save(operatorData);
  }catch (error){
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to save operator");
  }
})

export const deactivateOperator = createAsyncThunk("operator/deactive",async(id,thunkAPI) => {
    try{
        await axios.delete(`/operators/${id}`)
    }catch(error){
        return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete"  
      );
    }
});

export const fetchPendingOperators = createAsyncThunk("pendingoperator/fetchAll",async(_,thunkAPI) => {
    try{
        return await OperatorService.pendingOp();
    }catch(error){
        return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending operators"
        
      );
    }
});

export const activateOperator = createAsyncThunk("operator/activate",async(id,thunkAPI) => {
    try{
        await axios.patch(`/operators/${id}?status=Active`)
    }catch(error){
        return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete"  
      );
    }
});

const operatorSlice = createSlice({
    name: "operator",
    initialState:{
        list: [],
        page:0,
        size:5,
        totalPages: 0,
        totalElements: 0,
        pendinglist: [],
        loading: false,
        error: null,
    },
    reducers:{
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (build) => {
        build
        .addCase(fetchOperators.pending, (state) => {
        state.loading = true;   
        state.error = null;
        })
        .addCase(fetchOperators.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.content;
        state.size = action.payload.size;
        state.page = action.payload.number;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        })
        .addCase(fetchOperators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        })
        .addCase(saveOperator.pending,   (state) => { 
        state.loading = true; 
        state.error = null; 
        })
        .addCase(saveOperator.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
        })
        .addCase(saveOperator.rejected,  (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
        })
        
        .addCase(deactivateOperator.pending, (state) => {
        state.loading = true;   
        state.error = null;
        })
        .addCase(deactivateOperator.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map(op => op.userId === action.payload ? { ...op, userStatus: "InActive" } : op);
        })
        .addCase(deactivateOperator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        })
        .addCase(activateOperator.pending, (state) => {
        state.loading = true;   
        state.error = null;
        })
        .addCase(activateOperator.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map(op => op.userId === action.payload ? { ...op, userStatus: "Active" } : op);
        })
        .addCase(activateOperator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        })
        .addCase(fetchPendingOperators.pending, (state) => {
        state.loading = true;   
        state.error = null;
        })
        .addCase(fetchPendingOperators.fulfilled, (state, action) => {
        state.loading = false;
        state.pendinglist = action.payload;
        })
        .addCase(fetchPendingOperators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        })
    }
})

export const { clearError } = operatorSlice.actions;
export default operatorSlice.reducer;