import React, {useEffect, useState} from 'react';
import {Bar} from "@ant-design/plots";
import UserService from "../../services/UserService";

const TopUsers = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        UserService.getTopUsersForRental()
            .then((response) => {
                setData(response.topUsers);
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
                alias: 'Кількість оформлень'
            },
        },
    };

    return (
        <div>
            <h1>Топ працівників з оформлення договорів оренди</h1>
            <Bar {...config} style={{height: 150}}/>
        </div>
    );
};

export default TopUsers;