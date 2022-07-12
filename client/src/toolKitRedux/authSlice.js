import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import AuthService from "../services/AuthService";

export const login = createAsyncThunk(
    'auth/login',
    async function({ email, password }, { rejectWithValue }) {
        try {
            return await AuthService.login(email, password);
        } catch (error) {
            return rejectWithValue(error.response?.data?.errors[0]?.msg);
        }
    }
)

export const register = createAsyncThunk(
    'auth/register',
    async function({ email, password, confPassword }, { rejectWithValue }) {
        try {
            return await AuthService.registration(email, password, confPassword);
        } catch (error) {
            return rejectWithValue(error.response?.data?.errors[0]?.msg);
        }
    }
)

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async function(_, {rejectWithValue}){
        try {
            return await AuthService.checkAuth()
        } catch (error) {
            return rejectWithValue(error.response?.data?.errors[0]?.msg);
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async function(_, {rejectWithValue}){
        await AuthService.logout();
        localStorage.removeItem('token');
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authenticated: false,
        user: {},
        error: null,
        loading: false
    },
    reducers: {
        authenticatedTrue(state) {
            state.authenticated = true
        },
        authenticatedFalse(state) {
            state.authenticated = false
        },
        authUser(state, action) {
            state.user = action.payload;
        },
        errorNull(state) {
            state.error = null;
        }
    },
    extraReducers: {
        [login.pending]: (state, action) => {

        },
        [login.fulfilled]: (state, action) => {
            state.authenticated = true;
            state.user = action.payload?.data?.user;
        },
        [login.rejected]: (state, action) => {
            state.error = action.payload;
            state.authenticated = false;
            state.user = {}
        },

        [checkAuth.pending]: (state, action) => {
            state.loading = true;
        },
        [checkAuth.fulfilled]: (state, action) => {
            state.authenticated = true;
            state.loading = false;
            state.user = action.payload?.data?.user;
        },
        [checkAuth.rejected]: (state, action) => {
            state.authenticated = false;
            state.loading = false;
            state.user = {}
        },

        [logout.fulfilled]: (state, action) => {
            state.authenticated = false;
            state.user = {}
        },

        [register.rejected]: (state, action) => {
            state.error = action.payload;
            state.authenticated = false;
            state.user = {}
        },

        [register.fulfilled]: (state, action) => {
            state.authenticated = true;
            state.user = action.payload?.data?.user;
        },
    }
})

export default authSlice.reducer;
export const { authUser, errorNull, authenticatedFalse } = authSlice.actions;


