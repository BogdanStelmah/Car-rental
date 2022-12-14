import {Rate, Tag} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import React from "react";
import {ADMIN_ROUTE} from "../components/utils/consts";
import {Link} from "react-router-dom";

const toUAH = new Intl.NumberFormat("ua", {
    style: "currency",
    currency: "UAH",
    minimumFractionDigits: 0,
})

export const columns = (onDelete, navigate, authUser) => {
    const columns = [
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
            width: 190,
            render: (rating => {
                return <div><Rate disabled allowHalf value={rating}/> {rating}</div>
            })
        },
        {
            key: 'status',
            title: 'Статус',
            dataIndex: 'status',
            sorter: {multiple: 8},
            render: (record => {
                if (!record) {
                    return <Tag color="cyan">На паркінгу</Tag>
                }
                return <Tag color="red">В прокаті</Tag>
            }),
        },
        {
            key: 'price',
            title: 'Вартість оренди (1д)',
            dataIndex: 'price',
            width: 130,
            sorter: {multiple: 9},
            render: (record => {
                return toUAH.format(record);
            })
        },
    ]

    if (authUser.is_superuser) {
        columns.push(
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
        )
    }

    return columns;
}