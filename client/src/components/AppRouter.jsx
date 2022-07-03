import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {authRouters} from "../router";
import Admin from "../pages/Home/Admin";
import {useSelector} from "react-redux";
import {ADMIN_ROUTE, CAR_ROUTER, USERS_ROUTER} from "./utils/consts";
import CarPage from "../pages/Car/CarPage";
import UsersPage from "../pages/Users/UsersPage";

const AppRouter = () => {
    const isAuth = useSelector(state => state.auth.authenticated);

    return (
        !isAuth
            ?
            <Routes>
                {authRouters.map(({path, Component}) =>
                    <Route
                        key={path}
                        path={path}
                        element={Component}
                        exact
                    />
                )}
                <Route path='*' element={<Navigate to='/login' replace />}>

                </Route>
            </Routes>
            :
            <Routes>
                <Route path={ADMIN_ROUTE + "/*"} element={<Admin/>}>
                    <Route path={CAR_ROUTER} element={<CarPage/>}/>
                    <Route path={USERS_ROUTER} element={<UsersPage/>}/>
                </Route>
                <Route path='*' element={<Navigate to={ADMIN_ROUTE} replace />}>

                </Route>
            </Routes>
    );
};

export default AppRouter;