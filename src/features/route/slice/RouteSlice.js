import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../api/axiosInstance'
import RouteService from '../service/routeService';

export const fetchRoute = createAsyncThunk("route/fetchAll", async (_, thunkAPI) => {
  try {
    return await RouteService.getAll();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch routes");
  }
});

export const saveRoute = createAsyncThunk("route/save", async (routeData, thunkAPI) => {
  try{
    return await RouteService.save(routeData);
  }catch (error){
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to save route");
  }
})

export const deactivateRoute = createAsyncThunk("route/deactivate", async (id, thunkAPI) => {
  try {
    return await RouteService.deactivate(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to deactivate");
  }
});

export const activateRoute = createAsyncThunk("route/activate", async (id, thunkAPI) => {
  try {
    return await RouteService.activate(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to activate");
  }
});

const routeSlice = createSlice({
  name: "route",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoute.pending,(state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchRoute.fulfilled,(state, action) => { 
        state.loading = false; 
        state.list = action.payload;
      })
      .addCase(fetchRoute.rejected,(state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      })

      .addCase(saveRoute.pending,   (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(saveRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(saveRoute.rejected,  (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      .addCase(deactivateRoute.pending,(state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(deactivateRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map(r =>
          r.id === action.payload ? { ...r, status: "Inactive" } : r
        );
      })
      .addCase(deactivateRoute.rejected,(state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      .addCase(activateRoute.pending,(state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(activateRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map(r =>
          r.id === action.payload ? { ...r, status: "Active" } : r
        );
      })
      .addCase(activateRoute.rejected,(state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
  }
});

export const { clearError } = routeSlice.actions;
export default routeSlice.reducer;