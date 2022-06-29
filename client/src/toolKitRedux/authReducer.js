import {createAction, createReducer} from "@reduxjs/toolkit";


const initialState = {
    authenticated: false,
    user: {}
}

export const authenticatedTrue = createAction('AUTH_TRUE');
export const authenticatedFalse = createAction('AUTH_FALSE');
export const authUser = createAction('AUTH_USER');

export default createReducer(initialState, {
    [authenticatedTrue]: function (state) {
        state.authenticated = true
    },
    [authenticatedFalse]: function (state) {
        state.authenticated = false
    },
    [authUser]: function (state, action) {
        state.user = action.payload;
    }
})