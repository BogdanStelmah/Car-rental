import {Rate, Tag} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import React from "react";
import {ADMIN_ROUTE} from "../components/utils/consts";
import {Link} from "react-router-dom";

export const columns = (onDelete, navigate) => {
    return [
        {
            key: '1',
            title: '',
            render: (record => {
                return <Link to={`${ADMIN_ROUTE}/cars/${record._id}`}><EyeOutlined style={{color: "green"}}/></Link>
            })
        },
        {
            key: 'name',
            title: 'Назва',
            dataIndex: 'name',
            sorter: {multiple: 1}
        },
        {
            key: 'brand',
            title: 'Модель',
            dataIndex: 'brand',
            sorter: {multiple: 2}
        },
        {
            key: 'modelYear',
            title: 'Рік',
            dataIndex: 'modelYear',
            sorter: {multiple: 3}
        },
        {
            key: 'carType',
            title: 'Тип',
            dataIndex: 'carType',
            sorter: {multiple: 4},
            render: (services) => services.length ? services.map(service => service.type).join() : '-',
        },
        {
            key: 'numberPeople',
            title: 'Кількість місць',
            dataIndex: 'numberPeople',
            width: 100,
            sorter: {multiple: 5}
        },
        {
            key: 'color',
            title: 'Колір',
            dataIndex: 'color',
            sorter: {multiple: 6}
        },
        {
            key: 'rating',
            title: 'Рейтинг',
            dataIndex: 'rating',
            sorter: {multiple: 7},
            width: 170,
            render: (record => {
                return <Rate disabled allowHalf value={record}/>
            })
        },
        {
            key: 'status',
            title: 'Статус',
            dataIndex: 'status',
            sorter: {multiple: 8},
            render: (record => {
                if (record) {
                    return <Tag color="cyan">{record?.toString()}</Tag>
                }
                return <Tag color="red">{record?.toString()}</Tag>
            }),
        },
        {
            key: 'price',
            title: 'Вартість оренди (1д)',
            dataIndex: 'price',
            width: 130,
            sorter: {multiple: 9},
        },
        {
            key: '5',
            title: 'Дії',
            width: 80,
            render: (record) => {
                return (
                    <>
                        <EditOutlined
                            onClick={() => {navigate(ADMIN_ROUTE + `/cars/${record._id}/edit`)}}
                        />
                        <DeleteOutlined
                            onClick={() => {onDelete(record);}}
                            style={{color: '#d02828', marginLeft: 12}}
                        />
                    </>
                )
            }
        }
    ]
}