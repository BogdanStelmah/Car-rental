import {Tag} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import React from "react";

export const columns = (onDeleteUser, onEditUser, authUser) => {
    let columns = [
        {
            key: 'passportData.lastname',
            title: 'Прізвище',
            dataIndex: 'passportData',
            render: (services) => services.length ? services.map(service => service.lastname).join() : '-',
        },
        {
            key: 'passportData.firstname',
            title: 'Ім\'я',
            dataIndex: 'passportData',
            render: (services) => services.length ? services.map(service => service.firstname).join() : '-',
        },
        {
            key: 'passportData.secondName',
            title: 'По батькові',
            dataIndex: 'passportData',
            render: (services) => services.length ? services.map(service => service.secondName).join() : '-',
        },
        {
            key: '1',
            title: 'Email',
            dataIndex: 'email',
            sorter: {multiple: 1}
        },
        {
            key: '2',
            title: 'Адмін',
            dataIndex: 'is_superuser',
            render: (record => {
                if (record) {
                    return <Tag color="cyan">{record.toString()}</Tag>
                }
                return <Tag color="red">{record.toString()}</Tag>
            }),
            sorter: {multiple: 2}
        },
        {
            key: '3',
            title: 'Дата створення',
            dataIndex: 'createdAt',
            render: (record => {
                return record.replace('T', ' ').split('.')[0];
            }),
            sorter: {multiple: 3}
        },
        {
            key: '4',
            title: 'Дата обновлення',
            dataIndex: 'updatedAt',
            render: (record => {
                return record.replace('T', ' ').split('.')[0];
            }),
            sorter: {multiple: 4}
        }
    ]

    if (authUser.is_superuser) {
        columns.push(
            {
                key: '5',
                title: 'Дії',
                render: (record) => {
                    if (authUser._id === record._id) {
                        return (
                            <EditOutlined
                                onClick={() => {onEditUser(record);}}
                            />
                        )
                    }
                    return (
                        <>
                            <EditOutlined
                                onClick={() => {onEditUser(record);}}
                            />
                            <DeleteOutlined
                                onClick={() => {onDeleteUser(record);}}
                                style={{color: '#d02828', marginLeft: 12}}
                            />
                        </>
                    )
                }
            }
        )
    }

    return columns;
}

