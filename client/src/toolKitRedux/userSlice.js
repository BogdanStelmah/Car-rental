import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import UserService from "../services/UserService";

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async function(id, { rejectWithValue, dispatch}) {
        try {
            await UserService.deleteUser(id);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
)

export const editUser = createAsyncThunk(
    'user/editUser',
    async function(user, { rejectWithValue, dispatch}) {
        try {
            await UserService.editUser(user._id, user);
        } catch (error) {
            if (error.response?.data?.errors[0]?.msg) {
                return rejectWithValue(error.response?.data?.errors[0]?.msg);
            }
            if (error.response?.data?.message) {
                return rejectWithValue(error.response?.data?.message);
            }
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: [],
        error: null,
        status: null,
        message: null,
        loading: false
    },
    reducers: {
        setUser(state, action) {
            state.users = action.payload;
        },
        errorNull(state) {
            state.error = null;
        },
        messageNull(state) {
            state.message = null
        }
    },
    extraReducers: {
        [deleteUser.pending]: (state) => {
            state.status = 'loading';
            state.message = null;
        },
        [deleteUser.fulfilled]: (state) => {
            state.status = 'resolved';
            state.message = 'Видалено користувача';
        },
        [deleteUser.rejected]: (state, action) => {
            state.status = 'rejected';
            state.error = action.payload;
            state.message = null;
        },


        [editUser.pending]: (state) => {
            state.status = 'loading';
            state.error = null;
            state.message = null;
        },
        [editUser.fulfilled]: (state) => {
            state.status = 'resolved';
            state.message = 'Оновлено користувача';
        },
        [editUser.rejected]: (state, action) => {
            state.status = 'rejected';
            state.error = action.payload;
            state.message = null;
        },
    }
})

export default userSlice.reducer;
export const { errorNull, messageNull, setUser } = userSlice.actions;