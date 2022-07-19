import {Tag} from "antd";
import {CheckOutlined, DeleteOutlined} from "@ant-design/icons";
import React from "react";

export const columns = (onDelete, onEnd) => {
    return [
        {
            key: 'car.name',
            title: 'Назва автомобіля',
            dataIndex: 'car',
            sorter: {multiple: 1},
            fixed: 'left',
            width: 120,
            render: (services) => services.length ? services.map(service => service.name).join() : '-',
        },
        {
            key: 'car.number',
            title: 'Авто. номер',
            dataIndex: 'car',
            sorter: {multiple: 2},
            width: 120,
            render: (services) => services.length ? services.map(service => service.number).join() : '-',
        },
        {
            key: 'rentalPeriod',
            title: 'Днів оренди',
            dataIndex: 'rentalPeriod',
            width: 100,
            sorter: {multiple: 3},
        },
        {
            key: 'paymentAmount',
            title: 'Всього до сплати',
            dataIndex: 'paymentAmount',
            sorter: {multiple: 1},
            width: 140,
            render: (paymentAmount) => {
                return paymentAmount + ' грн'
            }
        },
        {
            key: 'deposit',
            title: 'Завдаток',
            dataIndex: 'deposit',
            sorter: {multiple: 2},
            width: 140,
            render: (deposit) => {
                return deposit + ' грн'
            }
        },
        {
            key: 'returnDate',
            title: 'Дата повернення',
            dataIndex: 'returnDate',
            width: 160,
            render: (record => {
                const fullDate = new Date(record)
                if (fullDate > new Date()) {
                    return <Tag color="cyan">{record.replace('T', ' ').split('.')[0]}</Tag>
                }
                return <Tag color="red">{record.replace('T', ' ').split('.')[0]}</Tag>
            }),
            sorter: {multiple: 3}
        },
        {
            key: 'user',
            title: 'Орендар',
            dataIndex: 'user',
            width: 270,
            render: (record => {
                return `${record[0]?.firstname} ${record[0]?.lastname} ${record[0]?.secondName}`
            }),
        },
        {
            key: 'admin',
            dataIndex: 'admin',
            title: 'Оформлювач',
            width: 200,
            render: (record => {
                return record[0]?.email;
            }),
        },
        {
            key: 'createdAt',
            dataIndex: 'createdAt',
            title: 'Дата оформлення',
            width: 150,
            render: (record => {
                return record.replace('T', ' ').split('.')[0];
            }),
            sorter: {multiple: 5}
        },
        {
            key: 'Дії',
            title: 'Дії',
            width: 80,
            render: (record) => {
                if (record.status) {
                    return null;
                }
                return (
                    <>
                        <CheckOutlined
                            onClick={() => {onEnd(record);}}
                        />
                        <DeleteOutlined
                            onClick={() => {onDelete(record);}}
                            style={{color: '#d02828', marginLeft: 12}}
                        />
                    </>
                )
            }
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Статус оренди',
            width: 120,
            fixed: 'right',
            render: (record => {
                if (record) {
                    return <Tag color="cyan">Закінчено</Tag>
                }
                return <Tag color="red">В оренді</Tag>
            }),
            sorter: {multiple: 4}
        },
    ]
}

