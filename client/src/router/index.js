import {ADMIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE} from "../components/utils/consts";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import Registration from "../pages/Registration";

export const authRouters = [
    { path: LOGIN_ROUTE, Component: <Login/>},
    { path: REGISTRATION_ROUTE, Component: <Registration/>}
]

export const publicRoutes = [
    { path: ADMIN_ROUTE, Component: <Admin/>},
]
