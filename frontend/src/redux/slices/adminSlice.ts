import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: null,
    token: null,
    isAuthenticated: false
}

const adminSlice = createSlice({
   name: "admin",
   initialState,
   reducers: {
    setAdmin: (state, action) => {
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.isAuthenticated = true
    },
    logOut: (state) => {
        state.admin = null;
        state.token = null;
        state.isAuthenticated = false
    }
   }
})


export const { setAdmin, logOut } = adminSlice.actions;
export default adminSlice.reducer;