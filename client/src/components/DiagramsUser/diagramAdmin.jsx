import React, {useEffect, useState} from 'react';
import {Bar} from "@ant-design/plots";
import UserService from "../../services/UserService";

const DiagramAdmin = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        UserService.getCountUsersByRole()
            .then((response) => {
                setData(response.countUser);
            })
    }, [])

    const config = {
        data,
        xField: 'count',
        yField: '_id',
        seriesField: '_id',
        legend: {
            position: 'top-left',
        },
        tooltip: {
            fields: ['count'],
        },
        meta: {
            count: {
                alias: 'Кількість користувачів'
            },
        },
    };

    return (
        <div>
            <h1>Діаграма ролей</h1>
            <Bar {...config} style={{height: 150}}/>
        </div>
    );
};

export default DiagramAdmin;