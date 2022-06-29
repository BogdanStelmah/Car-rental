import React, {useState} from 'react';
import classes from './LoginFrom.module.css';
import {NavLink} from "react-router-dom";
import {REGISTRATION_ROUTE} from "../utils/consts";
import AuthService from "../../services/AuthService";
import {useDispatch} from "react-redux";
import {authenticatedTrue, authUser} from "../../toolKitRedux/authReducer";

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch();

    const logIn = async (e) => {
        e.preventDefault();
        const response = await AuthService.login(email, password);

        dispatch(authenticatedTrue())
        dispatch(authUser(response.data.user))
    }

    return (
        <div className={classes.login__form}>
            <h1>Логін</h1>
            <form>
                <div className={classes.text__field}>
                    <label>Email</label>
                    <input
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        type="text"
                    />
                    {(email.validErrors && email.isDirty) &&
                        <div className={classes.valid__error}>{email.validErrors[0]}</div>
                    }
                </div>
                <div className={classes.text__field}>
                    <label>Пароль</label>
                    <input
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        type="password"
                    />
                </div>
                <button
                    className={classes.button__submit}
                    onClick={logIn}
                >
                    Логін
                </button>
                <div className={classes.signup_link}>
                    <NavLink to={REGISTRATION_ROUTE}>Створити обліковий запис</NavLink>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;