import {Carousel, Image, Rate} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import React from "react";
import {ADMIN_ROUTE} from "../components/utils/consts";

export const columns = (onDelete, navigate) => {
    return [
        {
            key: 'lastname',
            title: 'Прізвище',
            dataIndex: 'lastname',
            sorter: {multiple: 3},
            render: (record => {
                return record || '-'
            })
        },
        {
            key: 'firstname',
            title: 'Ім\'я',
            dataIndex: 'firstname',
            sorter: {multiple: 2},
            render: (record => {
                return record || '-'
            })
        },
        {
            key: 'secondName',
            title: 'По батькові',
            dataIndex: 'secondName',
            sorter: {multiple: 1},
            render: (record => {
                return record || '-'
            })
        },
        {
            key: 'phoneNumber',
            title: 'Номер телефону',
            dataIndex: 'phoneNumber',
            sorter: {multiple: 4},
            render: (record => {
                return record || '-'
            })
        },
        {
            key: 'sex',
            title: 'Стать',
            dataIndex: 'sex',
            sorter: {multiple: 5},
            render: (record => {
                return record || '-'
            })
        },
        {
            key: 'birthdate',
            title: 'Дата народження',
            dataIndex: 'birthdate',
            sorter: {multiple: 6},
            render: (record => {
                if (!record) {
                    return '-';
                }
                return record.split('T')[0];
            }),
        },
        {
            key: 'imageLink',
            title: 'Фото паспорту',
            dataIndex: 'imageLink',
            render: (record => {
                if (record.length !== 1) {
                    return (
                        <Carousel style={{width: '100px', marginRight: '10px'}}>
                            {record.map((image) =>
                                <div>
                                    <Image width={100} src={image.imageLink}/>
                                </div>
                            )}
                        </Carousel>
                    );
                } else {
                    return (
                        <div style={{width: '100px', marginRight: '10px'}}>
                            {record.map((image) =>
                                <div>
                                    <Image width={100} src={image.imageLink}/>
                                </div>
                            )}
                        </div>
                    )
                }
            })
        },
        {
            key: '5',
            title: 'Дії',
            width: 80,
            render: (record) => {
                return (
                    <>
                        <EditOutlined
                            onClick={() => {navigate(ADMIN_ROUTE + `/passportsData/${record._id}/edit`)}}
                        />
                        <DeleteOutlined
                            onClick={() => {onDelete(record)}}
                            style={{color: '#d02828', marginLeft: 12}}
                        />
                    </>
                )
            }
        }
    ]
}