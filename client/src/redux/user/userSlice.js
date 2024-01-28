import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;     
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateStart: (state) => {
            state.loading = true;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null; 
        },
        updateFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteFailure: (state, action) => {
            state.error = action.payload;
        },
        signOutSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        signOutFailure: (state, action) => {
            state.error = action.payload;
        }
        
    }
});

export const {signInFailure, signInStart, signInSuccess, 
    updateStart, updateFailure, 
    updateSuccess, deleteSuccess, deleteFailure, signOutSuccess, signOutFailure}  = userSlice.actions;

export default userSlice.reducer;