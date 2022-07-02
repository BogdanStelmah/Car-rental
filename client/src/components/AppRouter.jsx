import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {authRouters, publicRoutes} from "../router";
import Admin from "../pages/Admin";
import {useSelector} from "react-redux";

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
                <Route path='/' element={<Admin/>}>

                </Route>
                {publicRoutes.map(({path, Component}) =>
                    <Route
                    key={path}
                    path={path}
                    element={Component}
                    exact
                    />
                )}
                <Route path='*' element={<Navigate to='/' replace />}>

                </Route>
            </Routes>
    );
};

export default AppRouter;