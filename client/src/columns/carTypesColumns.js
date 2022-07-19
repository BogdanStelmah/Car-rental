import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import React from "react";

export const columns = (onDelete, onEdit) => {
    return [
        {
            key: 'type',
            title: 'Назва',
            dataIndex: 'type',
            sorter: {multiple: 1}
        },
        {
            key: 'description',
            title: 'Опис',
            dataIndex: 'description',
        },
        {
            key: '1',
            title: 'Дії',
            width: 80,
            render: (record) => {
                return (
                    <>
                        <EditOutlined
                            onClick={() => {onEdit(record)}}
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