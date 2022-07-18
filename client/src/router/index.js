import {ADMIN_ROUTE, CAR_ROUTER, LOGIN_ROUTE, REGISTRATION_ROUTE, USERS_ROUTER} from "../components/utils/consts";
import Admin from "../pages/Home/Admin";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import CarsPage from "../pages/Car/CarsPage";
import UsersPage from "../pages/Users/UsersPage";

export const authRouters = [
    { path: LOGIN_ROUTE, Component: <Login/>},
    { path: REGISTRATION_ROUTE, Component: <Registration/>}
]

export const publicRoutes = [
    { path: ADMIN_ROUTE, Component: <Admin/>},
]

export const homeRoutes = [
    { path: CAR_ROUTER, Component: <CarsPage/> },
    { path: USERS_ROUTER, Component: <UsersPage/> }
]
