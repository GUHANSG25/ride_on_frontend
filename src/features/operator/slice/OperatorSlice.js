import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../../../api/axiosInstance'

export const fetchOperators = createAsyncThunk("operator/fetchAll",async(_,thunkAPI) => {
    try{
        const res = await axios.get("/operators");
        // console.log(res.data);
        return res.data;
    }catch(error){
        return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch operators"
        
      );
    }
});

export const saveOperator = createAsyncThunk("operator/save", async (operatorData, thunkAPI) => {
  try{
    const res = await axios.post("/operators",operatorData);
    return res.data;
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
        const res = await axios.get("/operators/pending");
        // console.log(res.data);
        return res.data;
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
        state.list = action.payload;
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