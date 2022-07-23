import React, {useEffect, useState} from 'react';
import {CarService} from "../../services/CarService";
import {Area} from "@ant-design/plots";
import RentalService from "../../services/RentalService";
import {Button, DatePicker, Input, Row, Select} from "antd";
import {SearchOutlined} from "@ant-design/icons";

const { RangePicker } = DatePicker;

const RentalStatistics = () => {
    const [data, setData] = useState([]);
    const [dateStatistic, setDateStatistic] = useState()
    const [period, setPeriod] = useState()

    const toUAH = new Intl.NumberFormat("ua", {
        style: "currency",
        currency: "UAH",
        minimumFractionDigits: 0,
    })

    useEffect(() => {
        getStatistics();
    }, [])

    const config = {
        data,
        xField: '_id',
        yField: 'amount',
        tooltip: {
            fields: ['amount', 'count'],
        },
        meta: {
            amount: {
                alias: 'Сума оренд',
                formatter: (v) => `${toUAH.format(v)}`
            },
            count: {
                alias: 'Кількість оренд'
            },
        },
        pattern: {
            type: 'line',
            cfg: {
                stroke: '#043b02',
            },
        },
        areaStyle: () => {
            return {
                gradient: 'l(0) 0:#9c27b0 1:#ccccff',
            };
        },
        color: '#d4645a',
        slider: {
            start: 0,
            end: 1,
        },
    }

    const getStatistics = (params = null) => {
        RentalService.statistics(params)
            .then((response) => {
                setData(response.rentalsStatistics);
            })
    }

    const statistics = () => {
        const params = {}

        if (period !== 'day') {
            params["period"] = period;
        }
        if (dateStatistic) {
            params["createdAt"] = dateStatistic[0].format('YYYY-MM-DD') + "to" + dateStatistic[1].format('YYYY-MM-DD')
        }

        getStatistics(params);
    }

    return (

        <div>
            <h1>Статистика оренд автомобілів за певний період</h1>
            <Row style={{display: "flex", alignItems: 'flex-end'}}>
                <div>
                    Проміжок днів
                    <Row style={{marginBottom: 20}}>
                        <RangePicker value={dateStatistic} style={{width: 400}} size="large" onChange={(e) => {setDateStatistic(e)}}/>
                    </Row>
                </div>
                <div style={{marginLeft: 10}}>
                    Групування
                    <Row>
                        <Select
                            style={{
                                width: 100,
                                marginBottom: 20
                            }}
                            defaultValue="day"
                            size="large"
                            value={period}
                            onChange={setPeriod}
                        >
                            <Select.Option value="day">Дні</Select.Option>
                            <Select.Option value="month">Місяці</Select.Option>
                            <Select.Option value="year">Роки</Select.Option>
                        </Select>
                    </Row>
                </div>
                <div>
                    <div style={{marginLeft: 10}}>
                        <Row style={{marginBottom: 20}}>
                            <Button icon={<SearchOutlined />} size="large" style={{width: 100}} onClick={statistics}>Пошук</Button>
                        </Row>
                    </div>
                </div>
            </Row>
            <Area {...config}/>
        </div>
    );
}

export default RentalStatistics;