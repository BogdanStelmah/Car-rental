import React from 'react';
import classes from './LoginFrom.module.css';
import {NavLink} from "react-router-dom";
import {REGISTRATION_ROUTE} from "../utils/consts";

import {useDispatch, useSelector} from "react-redux";
import {errorNull, login} from "../../toolKitRedux/authSlice";
import {Button, Form, Input, message} from "antd";

const LoginForm = () => {
    const dispatch = useDispatch()
    const error = useSelector(state => state.auth.error);

    if (error) {
        message.error(error);
        dispatch(errorNull());
    }

    const logIn = (email, password) => {
        dispatch(login({ email, password }))
    }

    return (
        <div className={classes.login__form}>
            <h1>Логін</h1>
            <Form
                labelCol={{ span: 6 }}
                layout="vertical"
                autoComplete="off"
                onFinish={(values) => {logIn(values.Email, values.Password)}}
            >
                <Form.Item
                    name="Email"
                    label="Email"
                    rules={[
                        {
                            required:true,
                            message:'Будь ласка, введіть свій email'
                        },
                        { whitespace: true, message:'Неправильний формат' },
                        { type: 'email', message:'Неправильний формат'}
                    ]}
                    hasFeedback
                >
                    <Input
                        placeholder="Email"
                    />
                </Form.Item>
                <Form.Item
                    name="Password"
                    label="Пароль"
                    rules={[
                        {
                            required:true,
                            message:'Будь ласка, введіть пароль'
                        },
                        { whitespace: true, message:'Неправильний формат' },
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        placeholder="Пароль"
                    />
                </Form.Item>
                <Form.Item name="Login">
                    <Button
                        block
                        type="primary"
                        htmlType="submit"
                        className={classes.button__submit}
                    >
                        Увійти
                    </Button>
                    <div className={classes.signup_link}>
                        <NavLink to={REGISTRATION_ROUTE}>Створити обліковий запис</NavLink>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginForm;