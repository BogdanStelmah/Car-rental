import React from 'react';
import classes from './RegistrationFrom.module.css';
import {NavLink} from "react-router-dom";
import {LOGIN_ROUTE} from "../utils/consts";

const RegistrationFrom = () => {
    return (
        <div className={classes.registration__form}>
            <h1>Реєстрація</h1>
            <form>
                <div className={classes.text__field}>
                    <label>Email</label>
                    <input
                        type="email"
                    />
                </div>
                <div className={classes.text__field}>
                    <label>Пароль</label>
                    <input
                        type="password"
                    />
                </div>
                <div className={classes.text__field}>
                    <label>Підтвердити</label>
                    <input
                        type="password"
                    />
                </div>
                <button className={classes.button__submit}>Логін</button>
                <div className={classes.signup_link}>
                    <NavLink to={LOGIN_ROUTE}>Зайти в обліковий запис</NavLink>
                </div>
            </form>
        </div>
    );
};

export default RegistrationFrom;