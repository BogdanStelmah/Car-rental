import React, {useEffect, useState} from 'react';
import {message, Modal, Table, Input, Form, Checkbox, Tag} from "antd";

import {
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

import {useDispatch, useSelector} from "react-redux";
import {deleteUser, errorNull, editUser, messageNull, setUser} from "../../toolKitRedux/userSlice";
import {queryParser} from "../../components/utils/queryParser";
import UserService from "../../services/UserService";
import Search from "antd/es/input/Search";

const UsersPage = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [editingUser, setEditingUser] = useState(null)

    const [totalPages, setTotalPages] = useState(0);
    const [params, setParams] = useState({
        email: '',
        skip: 1,
        limit: 5
    });
    const dispatch = useDispatch()

    const authUser = useSelector(state => state.auth.user)
    const allUser = useSelector(state => state.user);

    const onSearch = (value) => {
        setParams({...params, email: value, skip: 1})
    }

    const handleTableChange = (newPagination, filters, sorter) => {
        const newParams = queryParser(newPagination, filters, sorter)
        setParams({...newParams, email: params.email});
    }

    useEffect(() => {
        UserService.fetchUsers(params).then((response) => {
            setTotalPages(response.totalCount)
            dispatch(setUser(response.users));
        })
    }, [params])

    useEffect(() => {
        if (allUser.error) {
            message.error(allUser.error);
            dispatch(errorNull());
        }
    }, [allUser.error])

    useEffect(() => {
        if (allUser.status === 'resolved') {
            setIsEdit(false);
            UserService.fetchUsers(params).then((response) => {
                dispatch(setUser(response.users))
            });
        }
    }, [allUser.status]);

    useEffect(() => {
        if (allUser.message) {
            message.success(allUser.message)
            dispatch(messageNull());
        }
    }, [allUser.message])

    const onDeleteUser = (record) => {
        Modal.confirm({
            title: "Ви впевнені, що хочете видалити цього користувача?",
            okText: "Так",
            okType: "danger",
            cancelText: "Відміна",
            onOk: () => {
                dispatch(deleteUser(record._id));
                UserService.fetchUsers(params).then((response) => {
                    dispatch(setUser(response.users))
                });
            }
        });
    };

    const onEditUser = (record) => {
        setIsEdit(true);
        setEditingUser({...record});
    };

    const columns = [
        {
            key:'1',
            title:'Email',
            dataIndex:'email',
            sorter: {multiple: 1}
        },
        {
            key:'2',
            title:'Адмін',
            dataIndex:'is_superuser',
            render:(record => {
                if (record) {
                    return <Tag color="cyan">{record.toString()}</Tag>
                }
                return <Tag color="red">{record.toString()}</Tag>
            }),
            sorter: {multiple: 2}
        },
        {
            key:'3',
            title:'Дата створення',
            dataIndex:'createdAt',
            render:(record => {
                return record.replace('T', ' ').split('.')[0];
            }),
            sorter: {multiple: 3}
        },
        {
            key:'4',
            title:'Дата обновлення',
            dataIndex:'updatedAt',
            render:(record => {
                return record.replace('T', ' ').split('.')[0];
            }),
            sorter: {multiple: 4}
        },
        {
            key:'5',
            title:'Дії',
            render: (record) => {
                if (authUser._id === record._id) {
                    return
                }
                return (
                    <>

                        <EditOutlined
                            onClick={() => {
                                onEditUser(record);
                            }}
                        />
                        <DeleteOutlined
                            onClick={() =>{
                                onDeleteUser(record);
                            }}
                            style={{ color: '#d02828', marginLeft: 12 }}
                        />
                    </>
                )
            }
        }
    ]

    return (
        <div>
            <Search placeholder="Пошук..." size='large' onSearch={onSearch} style={{width: 400, marginBottom: 20}}/>
            <Table
                loading={allUser.loading}
                columns={columns}
                dataSource={allUser.users}
                pagination={{
                    total: totalPages,
                    current: params.skip,
                    pageSize: params.limit
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
                    setIsEdit(false);
                }}
                onOk={() => {
                    dispatch(editUser(editingUser))
                }}
            >
                <Form>
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