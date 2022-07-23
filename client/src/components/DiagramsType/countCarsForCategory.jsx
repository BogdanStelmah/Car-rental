import React, {useEffect, useState} from 'react';
import {CarService} from "../../services/CarService";
import {Bar} from "@ant-design/plots";
import CarTypeService from "../../services/CarTypeService";

const CountCarsForCategory = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        CarTypeService.countCarsForCategory()
            .then((response) => {
                setData(response.countCarsForCategory);
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
                alias: 'Кількість автомобілів'
            },
        },
    };

    return (
        <div>
            <h1>Кількість автомобілів для кожної категорії</h1>
            <Bar {...config} style={{height: 150}}/>
        </div>
    );
};

export default CountCarsForCategory;