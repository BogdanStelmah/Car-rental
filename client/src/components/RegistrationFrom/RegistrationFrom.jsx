import React from 'react';
import classes from './RegistrationFrom.module.css';
import {NavLink} from "react-router-dom";
import {LOGIN_ROUTE} from "../utils/consts";
import {Button, Form, Input, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {errorNull, register} from "../../toolKitRedux/authSlice";

const RegistrationFrom = () => {
    const dispatch = useDispatch()
    const error = useSelector(state => state.auth.error);

    if (error) {
        message.error(error);
        dispatch(errorNull());
    }

    const registration = (email, password, confPassword) => {
        dispatch(register({email, password, confPassword}));
    }

    return (
        <div className={classes.registration__form}>
            <h1>Реєстрація</h1>
            <Form
                layout="vertical"
                autoComplete="off"
                onFinish={(values) => {registration(values.email, values.password, values.confirmPassword)}}
            >
                <Form.Item
                    name="email"
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
                        type="email"
                        placeholder="Email"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
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
                <Form.Item
                    name="confirmPassword"
                    label="Підтвердити пароль"
                    rules={[
                        {
                            required:true,
                            message:'Будь ласка, введіть пароль'
                        },
                        { whitespace: true, message:'Неправильний формат' },
                        ({ getFieldValue }) => ({
                            validator(_, value){
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve()
                                }
                                return Promise.reject('Паролі не співпадають')
                            }
                        }),
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        placeholder="Підтвердити пароль"
                    />
                </Form.Item>
                <Form.Item name="Register">
                    <Button
                        block
                        type="primary"
                        htmlType="submit"
                        className={classes.button__submit}
                    >
                        Зареєструватися
                    </Button>
                    <div className={classes.signup_link}>
                        <NavLink to={LOGIN_ROUTE}>Увійти в обліковий запис</NavLink>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegistrationFrom;