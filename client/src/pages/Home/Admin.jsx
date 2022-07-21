import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {logout} from "../../toolKitRedux/authSlice";

import {
    UserOutlined,
    LogoutOutlined,
    CarOutlined,
    SnippetsOutlined,
    HighlightOutlined,
    UnorderedListOutlined,
    FileImageOutlined,
    FormatPainterOutlined,
    DatabaseOutlined,

} from '@ant-design/icons';

import {Avatar, Layout, Menu} from 'antd';

import classes from "./Admin.module.css";
import {Outlet, useNavigate} from "react-router-dom";
import {
    CAR_ROUTER,
    CAR_TYPE_ROUTER,
    PASSPORT_DATA_ROUTER,
    RENTAL_ROUTER,
    USERS_ROUTER
} from "../../components/utils/consts";

const { Header, Content, Sider } = Layout;

const Admin = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user);

    const logOut = () => {
        dispatch(logout())
    }

    let navigate = useNavigate();
    useEffect(() => {
        navigate(CAR_ROUTER);
    }, []);

    return (
        <Layout
            style={{
                minHeight: '100%'
            }}
        >
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                }}
                onCollapse={(collapsed, type) => {
                }}
            >
                <div className="logo"/>
                    <div className={classes.logo}>
                        CarRental
                    </div>
                <div/>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['2']}
                >
                    <Menu.Item key={1} onClick={() => {navigate(USERS_ROUTER)}}>
                        <UserOutlined/> Користувачі
                    </Menu.Item>
                    <Menu.Item key={2} onClick={() => {navigate(CAR_ROUTER)}}>
                        <CarOutlined /> Автомобілі
                    </Menu.Item>
                    <Menu.Item key={3} onClick={() => {navigate(CAR_TYPE_ROUTER)}}>
                        <FormatPainterOutlined /> Типи автомобілів
                    </Menu.Item>
                    <Menu.Item key={4} onClick={() => {navigate(RENTAL_ROUTER)}}>
                        <UnorderedListOutlined /> Замовлення
                    </Menu.Item>
                    <Menu.Item key={8} onClick={() => {navigate(PASSPORT_DATA_ROUTER)}}>
                        <SnippetsOutlined />Паспортні данні
                    </Menu.Item>
                    <Menu.Item key={6}>
                        <DatabaseOutlined /> DB Tools
                    </Menu.Item>
                    <Menu.Item onClick={logOut} key={9}>
                        <LogoutOutlined/> Вихід
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header
                    className="siteLayoutSubHeaderBackground"
                    style={{
                        padding: 0,
                        background: "#3f3f3f",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <div className={classes.email_user}>{user.email}</div>
                    <Avatar style={{backgroundColor: '#07bdc9', marginRight: '10px'}} icon={<UserOutlined/>}/>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px 0',
                    }}
                >
                    <div
                        className="site-layout-background"
                        style={{
                            padding: 24,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Admin;