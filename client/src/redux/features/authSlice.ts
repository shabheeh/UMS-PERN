import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, AuthState } from "../../types/authTypes";

const initialState: AuthState = {
    isAuthenticated: false,
    user: null
};

interface SignInPayload {
    user: User;
    isAuthenticated: boolean
}



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signIn: (state, action: PayloadAction<SignInPayload>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },

        signOut: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },

        setUser: (state, action: PayloadAction<User>) => {
            state.user = {
                ...state.user,
                ...action.payload
            };
        },

        setAuthState:  (state) => {
            state.isAuthenticated = true;
        },
    },
});

export const { signIn, signOut, setUser, setAuthState } = authSlice.actions;
export default authSlice.reducer;