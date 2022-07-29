import React, {useEffect, useState} from 'react';
import {Bar} from "@ant-design/plots";
import {CarService} from "../../services/CarService";

const RatingCarsRental = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        CarService.getRatingCarsRental()
            .then((response) => {
                setData(response.carRating);
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
                alias: 'Кількість оренд'
            },
        },
    };

    return (
        <div>
            <h1>Рейтинг автомобілей по кількості оренд</h1>
            <Bar {...config} style={{height: 150}}/>
        </div>
    );
};

export default RatingCarsRental;