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

const { Option } = Select;

const UsersPage = () => {
    const [searchByField, setSearchByField] = useState('email');
    const [searchText, setSearchText] = useState()
    const [paramSearch, setParamSearch] = useState( );

    const [totalPages, setTotalPages] = useState(0);
    const [paramTable, setParamTable] = useState({
        skip: 1,
        limit: 5
    });

    const [isEdit, setIsEdit] = useState(false);
    const [editingUser, setEditingUser] = useState(null)
    const [passportData, setPassportData] = useState({
        firstname: '',
        lastname: '',
        secondName: ''
    });

    const dispatch = useDispatch()

    const authUser = useSelector(state => state.auth.user)
    const allUser = useSelector(state => state.user);

    const search = () => {
        setParamSearch({[searchByField]: searchText});
    }

    const handleTableChange = (newPagination, filters, sorter) => {
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
        dispatch(editUser(editingUser))

        const formData = new FormData();
        for (const passportDataKey in passportData) {
            formData.append(passportDataKey, passportData[passportDataKey] || '');
        }

        PasswordDataService.editPassportData(editingUser._id, formData)
            .then(() => {
                getUsers()
            })
            .catch()
    }

    const onDeleteUser = (record) => {
        Modal.confirm({
            title: "Ви впевнені, що хочете видалити цього користувача?",
            okText: "Так",
            okType: "danger",
            cancelText: "Відміна",
            onOk: () => {
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
            <Input
                allowClear
                placeholder="Пошук"
                size='large'
                style={{width: 300, marginBottom: 20}}
                onChange={handleTextSearch}
            />
            <Select
                defaultValue="email"
                style={{
                    width: 140,
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
            <Button icon={<SearchOutlined />} onClick={search} size="large">Search</Button>
            <Table
                loading={allUser.loading}
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
                    <Form.Item>
                        <Checkbox checked={editingUser?.is_superuser} onChange={(event => {
                            setEditingUser(pre => {
                                return {...pre, is_superuser:event.target.checked}
                            })
                        })}>
                            Роль адміністратора
                        </Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UsersPage;