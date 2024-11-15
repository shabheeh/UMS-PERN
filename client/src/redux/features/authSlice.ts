import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserActionPayload, AuthState } from "../../types/authTypes";

const initialState: AuthState = {
    isAuthenticated: false,
    user: {
        email: null,
        accessToken: null,
    },
    profile: {
        name: null,
        email : null,
        phone: null,
        image: null,
        isBlocked: false
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Reducer to handle signing in and setting basic user data
        signIn: (state, action: PayloadAction<UserActionPayload>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },


        signOut: (state) => {
            state.isAuthenticated = false;
            state.user = { email: null, accessToken: null };
            state.profile = { name: null, email: null, phone: null,  image: null, isBlocked: false };
        },

        updateProfile: (state, action) => {
            state.profile = { ...state.profile, ...action.payload };
        },
    },
});


export const { signIn, signOut, updateProfile } = authSlice.actions;

export default authSlice.reducer;
