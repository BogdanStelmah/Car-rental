import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {authRouters} from "../router";
import Admin from "../pages/Home/Admin";
import {useSelector} from "react-redux";
import {
    ADMIN_ROUTE,
    CAR_CREATED,
    CAR_EDIT,
    CAR_PAGE,
    CAR_ROUTER,
    CAR_TYPE_ROUTER,
    LOGIN_ROUTE, PASSPORT_DATA_CREATE_ROUTER, PASSPORT_DATA_EDIT_ROUTER, PASSPORT_DATA_ROUTER, RENTAL_ROUTER,
    USERS_ROUTER
} from "./utils/consts";
import CarsPage from "../pages/Car/CarsPage";
import UsersPage from "../pages/Users/UsersPage";
import CarCreatePage from "../pages/Car/CarCreatePage";
import CarEdit from "../pages/Car/CarEdit";
import CarPage from "../pages/Car/CarPage";
import CarTypesPage from "../pages/CarType/CarTypesPage";
import RentalsPage from "../pages/Rentals/RentalsPage";
import PassportDataPage from "../pages/PassportData/PassportDataPage";
import PassportDataCreatePage from "../pages/PassportData/PassportDataCreatePage";
import PassportDataEditPage from "../pages/PassportData/PassportDataEditPage";

const AppRouter = () => {
    const isAuth = useSelector(state => state.auth.authenticated);

    return (
        !isAuth
            ?
            <Routes>
                {authRouters.map(({path, Component}) =>
                    <Route key={path} path={path} element={Component} exact/>
                )}
                <Route path='*' element={<Navigate to={LOGIN_ROUTE} replace />}>

                </Route>
            </Routes>
            :
            <Routes>
                <Route path={ADMIN_ROUTE + "/*"} element={<Admin/>}>
                    <Route path={CAR_CREATED} element={<CarCreatePage/>}/>
                    <Route path={CAR_ROUTER} element={<CarsPage/>}/>
                    <Route path={CAR_EDIT} element={<CarEdit/>}/>
                    <Route path={CAR_PAGE} element={<CarPage/>}/>

                    <Route path={USERS_ROUTER} element={<UsersPage/>}/>

                    <Route path={CAR_TYPE_ROUTER} element={<CarTypesPage/>}/>

                    <Route path={RENTAL_ROUTER} element={<RentalsPage/>}/>

                    <Route path={PASSPORT_DATA_ROUTER} element={<PassportDataPage/>}/>
                    <Route path={PASSPORT_DATA_CREATE_ROUTER} element={<PassportDataCreatePage/>}/>
                    <Route path={PASSPORT_DATA_EDIT_ROUTER} element={<PassportDataEditPage/>}/>
                </Route>
                <Route path='*' element={<Navigate to={ADMIN_ROUTE} replace />}>

                </Route>
            </Routes>
    );
};

export default AppRouter;