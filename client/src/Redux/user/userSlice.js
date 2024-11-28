import { createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  Currentuser: null,
  loading: false,
  error: null,
};

// Create the slice using createSlice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: state => {
      state.loading = true;
      state.error = null;
    },
    signInSucess: (state, action) => {
      state.loading = false;
      state.Currentuser = action.payload;
      state.error = null
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSucess: (state, action) => {
      state.loading = false;
      state.Currentuser = action.payload;
      state.error = null
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
   deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSucess: (state, action) => {
      state.loading = false;
      state.Currentuser = null;
      state.error = null
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutSucess: (state) => {
      state.loading = false;
      state.Currentuser = null;
      state.error = null
    },
  },
});

// Extract the action creators from the slice
export const { 
  signInStart, 
  signInSucess, 
  signInFailure, 
  updateStart, 
  updateSucess, 
  updateFailure,
  deleteUserStart,
  deleteUserSucess,
  deleteUserFailure,
  signOutSucess
} = userSlice.actions;

// Export the reducer function
export default userSlice.reducer;