import React from 'react';
import {useDispatch} from "react-redux";
import {logout} from "../toolKitRedux/authSlice";

const Admin = () => {
    const dispatch = useDispatch()

    const logOut = (e) => {
        e.preventDefault();
        dispatch(logout())
    }

    return (
        <div>
           Admin
            <button onClick={logOut}>Вихід</button>
        </div>
    );
};

export default Admin;