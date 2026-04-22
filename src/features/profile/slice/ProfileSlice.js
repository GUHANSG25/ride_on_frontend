import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ProfileService from "../service/ProfileService";

export const fetchUserProfile = createAsyncThunk("user/profile",async(_,thunkAPI) => {
    try{
        return await ProfileService.getProfile();        
    }catch(error){
        return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile" 
      );
    }
});

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (data, thunkAPI) => {
    try {
      return await ProfileService.updateProfile(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const ProfileSlice = createSlice({
    name: "profile",
    initialState:{
        profile: null,
        loading: false,
        error: null,
    },
    reducers:{
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (build) => {
        build
        .addCase(fetchUserProfile.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        .addCase(fetchUserProfile.fulfilled, (state,action) => {
            state.loading = false;
            state.profile = action.payload;
        })
        .addCase(fetchUserProfile.rejected, (state,action) => {
            state.error = action.payload;
            state.loading = false;
        })
        .addCase(updateUserProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload;
        })
        .addCase(updateUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
    
})

export const { clearError } = ProfileSlice.actions;
export default ProfileSlice.reducer;