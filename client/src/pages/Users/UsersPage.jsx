import React, {useEffect, useState} from 'react';
import {message, Modal, Table, Input, Form, Checkbox, Select, Button} from "antd";
import { SearchOutlined } from '@ant-design/icons';

import {useDispatch, useSelector} from "react-redux";
import {deleteUser, errorNull, editUser, messageNull, setUser} from "../../toolKitRedux/userSlice";

import {queryParser} from "../../components/utils/queryParser";

import UserService from "../../services/UserService";
import PasswordDataService from "../../services/PasswordDataService";

import PassportDataTDO from "./DTO/PassportDataTDO";
import {columns} from "../../columns/userColumns";
import classes from "./User.module.css";
import DiagramAdmin from "../../components/DiagramsUser/diagramAdmin";
import TopUsers from "../../components/DiagramsUser/topUsers";

const { Option } = Select;

const UsersPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [valueIsSuperUser, setValueIsSuperUser] = useState('any');

    const [searchByField, setSearchByField] = useState('email');
    const [searchText, setSearchText] = useState();
    const [paramSearch, setParamSearch] = useState();

    const [totalPages, setTotalPages] = useState(0);
    const [paramTable, setParamTable] = useState({
        skip: 1,
        limit: 7
    });

    const [isEdit, setIsEdit] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [passportData, setPassportData] = useState({
        firstname: '',
        lastname: '',
        secondName: ''
    });

    const dispatch = useDispatch();

    const authUser = useSelector(state => state.auth.user);
    const isSuperuser = useSelector(state => state.auth.user.is_superuser);
    const allUser = useSelector(state => state.user);

    const search = () => {
        setIsLoading(true);
        setParamTable({...paramTable, skip: 1})
        setParamSearch({[searchByField]: searchText, ['is_superuser']: valueIsSuperUser});
    }

    const handleTableChange = (newPagination, filters, sorter) => {
        setIsLoading(true);
        setParamTable(queryParser(newPagination, filters, sorter));
    }

    const handleTextSearch = (value) => {
        if (value.target.value !== '') {
            setSearchText(value.target.value)
            return;
        }
        setSearchText(undefined);
    }

    const getUsers = () => {
        UserService.fetchUsers({...paramTable, ...paramSearch}).then((response) => {
            setTotalPages(response.totalCount)
            dispatch(setUser(response.users));
            setIsLoading(false);
        })
    }

    useEffect(() => {
        getUsers();
    }, [paramTable, paramSearch])

    useEffect(() => {
        if (allUser.error) {
            message.error(allUser.error);
            dispatch(errorNull());
        }
    }, [allUser.error])

    useEffect(() => {
        if (allUser.status === 'resolved') {
            setIsEdit(false);
            getUsers()
        }
    }, [allUser.status]);

    useEffect(() => {
        if (allUser.message) {
            message.success(allUser.message)
            dispatch(messageNull());
        }
    }, [allUser.message])


    const handleRequest = () => {
        setIsLoading(true);

        dispatch(editUser(editingUser))

        const formData = new FormData();
        for (const passportDataKey in passportData) {
            formData.append(passportDataKey, passportData[passportDataKey] || '');
        }

        PasswordDataService.editPassportDataToUser(editingUser._id, formData)
            .then(() => {
                getUsers()
            })
            .catch()
            .finally(() => {
                setIsLoading(false);
            })
    }

    const onDeleteUser = (record) => {
        Modal.confirm({
            title: "Ви впевнені, що хочете видалити цього користувача?",
            okText: "Так",
            okType: "danger",
            cancelText: "Відміна",
            onOk: () => {
                setIsLoading(true);
                dispatch(deleteUser(record._id));
                getUsers()
            }
        });
    };

    const onEditUser = (record) => {
        setIsEdit(true);
        setEditingUser({...record});
        setPassportData(new PassportDataTDO({...record?.passportData[0]}))
    };

    return (
        <div>
            <div className={classes.block__filters}>
                <div>
                    <Input
                        allowClear
                        placeholder="Пошук"
                        size='large'
                        style={{width: 200}}
                        onChange={handleTextSearch}
                    />
                </div>
                <div>
                    <div>
                        Поле пошуку
                    </div>
                    <Select
                        defaultValue="email"
                        style={{
                            width: 140,
                            marginRight: '10px',
                        }}
                        size="large"
                        onChange={(value) => {setSearchByField(value)}}
                        showSearch
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    >
                        <Option value="email">Email</Option>
                        <Option value="passportData.firstname">Ім'я</Option>
                        <Option value="passportData.lastname">Призвище</Option>
                        <Option value="passportData.secondName">По батькові</Option>
                    </Select>
                </div>
                <div>
                    <div>
                        Роль
                    </div>
                    <Select
                        style={{
                            width: '200px',
                            marginRight: '10px',
                        }}
                        defaultValue="any"
                        size="large"
                        value={valueIsSuperUser}
                        onChange={setValueIsSuperUser}
                    >
                        <Select.Option value="any">Будь-якa</Select.Option>
                        <Select.Option value="true">Адмін</Select.Option>
                        <Select.Option value="false">Не адмін</Select.Option>
                    </Select>
                </div>
                <div>
                    <Button icon={<SearchOutlined />} onClick={search} size="large" style={{width: 130}}>Search</Button>
                </div>
            </div>
            <Table
                loading={isLoading}
                columns={columns(onDeleteUser, onEditUser, authUser)}
                dataSource={allUser.users}
                pagination={{
                    total: totalPages,
                    current: paramTable.skip,
                    pageSize: paramTable.limit
                }}
                onChange={handleTableChange}
            >
            </Table>
            <Modal
                title='Редагування даних користувача'
                visible={isEdit}
                okText="Зберегти"
                cancelText="Відміна"
                onCancel={() => {
                    setPassportData({})
                    setIsEdit(false);
                }}
                onOk={() => {
                    handleRequest();
                    setIsEdit(false);
                    setPassportData({})
                }}
            >
                <Form
                    labelCol={{ span: 6 }}
                    layout="vertical"
                >
                    <Form.Item label="Ім'я">
                        <Input value={passportData.firstname} onChange={(event => {
                            setPassportData({...passportData, firstname: event.target.value})
                        })}/>
                    </Form.Item>
                    <Form.Item label="Прізвище">
                        <Input value={passportData.lastname} onChange={(event => {
                            setPassportData({...passportData, lastname: event.target.value})
                        })}/>
                    </Form.Item>
                    <Form.Item label="По батькові">
                        <Input value={passportData.secondName} onChange={(event => {
                            setPassportData({...passportData, secondName: event.target.value})
                        })}/>
                    </Form.Item>
                    <Form.Item
                        label="Email"
                    >
                        <Input
                            type="email"
                            placeholder="Email"
                            value={editingUser?.email}
                            onChange={(event => {
                                setEditingUser(pre => {
                                    return {...pre, email:event.target.value}
                                })
                            })}
                        />
                    </Form.Item>
                    {editingUser?._id !== authUser?._id &&
                    <Form.Item>
                        <Checkbox checked={editingUser?.is_superuser} onChange={(event => {
                            setEditingUser(pre => {
                                return {...pre, is_superuser:event.target.checked}
                            })
                        })}>
                            Роль адміністратора
                        </Checkbox>
                    </Form.Item>
                    }
                </Form>
            </Modal>
            <DiagramAdmin/>
            <TopUsers/>
        </div>
    );
};

export default UsersPage;