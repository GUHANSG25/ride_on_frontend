import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../api/axiosInstance'
import RouteService from '../service/routeService';

export const fetchRoute = createAsyncThunk("route/fetchAll", async ({page,size}, thunkAPI) => {
  try {
    return await RouteService.getAll(page,size);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch routes");
  }
});

export const fetchRouteById = createAsyncThunk("route/fetchById", async (id, thunkAPI) => {
  try {
    return await RouteService.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch route");
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
    page:0,
    size:5,
    totalPages: 0,
    totalElements: 0,
    loading: false,
    error: null,
    route: null,
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
        state.list = action.payload.content;
        state.size = action.payload.size;
        state.page = action.payload.number;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchRoute.rejected,(state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      })
      .addCase(fetchRouteById.pending,(state) => { 
        state.loading = true; 
        state.error = null; 
      }).addCase(fetchRouteById.fulfilled,(state, action) => { 
        state.loading = false; 
        state.route = action.payload; 
      }).addCase(fetchRouteById.rejected,(state, action) => { 
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