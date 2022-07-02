import React, {useEffect} from "react";
import './style/style.css';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import {useDispatch} from "react-redux";
import {checkAuth} from "./toolKitRedux/authSlice";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        if(localStorage.getItem('token')) {
            dispatch(checkAuth())
        }
    })
    return(
        <BrowserRouter>
            <AppRouter/>
        </BrowserRouter>
    )
}

export default App;


