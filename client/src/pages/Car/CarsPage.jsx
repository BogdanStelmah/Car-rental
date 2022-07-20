import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Input, Modal, Rate, Row, Select, Slider, Table} from "antd";
import {queryParser} from "../../components/utils/queryParser";
import {CarService} from "../../services/CarService";
import {columns} from "../../columns/carColumns";
import {ADMIN_ROUTE, CAR_CREATED} from "../../components/utils/consts";
import {useNavigate} from "react-router-dom";
import classes from './CarCreatePage.module.css';
import {Option} from "antd/es/mentions";
import CarTypeService from "../../services/CarTypeService";
import {SearchOutlined, RetweetOutlined} from "@ant-design/icons";

const CarsPage = () => {
    let navigate = useNavigate();

    const [carTypes, setCarTypes] = useState(null);
    const [carColor, setCarColor] = useState(null);

    const [dataSource, setDataSource] = useState();
    const [totalPages, setTotalPages] = useState(0);

    const [searchParams, setSearchParams] = useState()
    const [params, setParams] = useState({
        skip: 1,
        limit: 5
    });

    //filters
    const [searchText, setSearchText] = useState(null)
    const [searchByField, setSearchByField] = useState('name');
    const [valueNumberPeople, setValueNumberPeople] = useState(1);
    const [valueModelYear, setValueModelYear] = useState({from: new Date().getFullYear() - 40, to: new Date().getFullYear()});

    const ratingDescription = ['жахливо', 'погано', 'нормально', 'добре', 'чудово'];
    const [valueRating, setValueRating] = useState(1);

    const [valueStatus, setValueStatus] = useState('any');
    const [selectColor, setSelectColor] = useState('any');
    const [selectType, setSelectType] = useState('any');

    const handleTextSearch = (value) => {
        if (value.target.value !== '') {
            setSearchText(value.target.value)
            return;
        }
        setSearchText(undefined);
    }

    const resetFilterForm = () => {
        setSearchText(null);
        setSearchByField('name');
        setValueNumberPeople(1);
        setValueModelYear({from: new Date().getFullYear() - 40, to: new Date().getFullYear()});
        setValueRating(1);
        setValueStatus('any');
        setSelectType('any');
        setSelectColor('any');
        setSearchParams();
    }

    const search = () => {
        const data = {}

        if (searchText) {
            data[searchByField] = searchText;
        }
        if (selectType !== 'any') {
            data["carType.type"] = selectType;
        }
        if (selectColor !== 'any') {
            data["color"] = selectColor;
        }
        if (valueStatus !== 'any') {
            data["status"] = valueStatus;
        }
        data["numberPeople"] = valueNumberPeople;
        data["rating"] = valueRating;
        data["modelYear"] = valueModelYear.from + "to" + valueModelYear.to;

        setSearchParams(data);
    }

    const getCar = () => {
        CarService.fetchCars({...params, ...searchParams}).then((response) => {
            setTotalPages(response.totalCount)
            setDataSource(response.cars);
        })
    }

    useEffect(() => {
        CarService.fetchColors()
            .then((response) => {
                setCarColor(response.colors);
            })

        CarTypeService.fetchCarTypes()
            .then((response) => {
                setCarTypes(response.carTypes);
            } )

        getCar();
    }, [params, searchParams])

    const handleTableChange = (newPagination, filters, sorter) => {
        const newParams = queryParser(newPagination, filters, sorter)
        setParams({...newParams});
    }

    const onDeleteCar = (record) => {
        Modal.confirm({
            title: "Ви впевнені, що хочете видалити цей автомобіль?",
            okText: "Так",
            okType: "danger",
            cancelText: "Відміна",
            onOk: () => {
                CarService.deleteCar(record._id).then(() => {
                    getCar();
                });
            }
        });
    };

    return (
        <div>
            <Button onClick={() => navigate(ADMIN_ROUTE + "/" + CAR_CREATED)}>Додати автомобіль</Button>
            <div className={classes.cars__filters__block}>
                <div className={classes.filters__block__left}>
                    <div>
                        <Input
                            allowClear
                            placeholder="Пошук"
                            size='large'
                            value={searchText}
                            style={{width: '70%', marginBottom: 20}}
                            onChange={handleTextSearch}
                        />
                        <Select
                            value={searchByField}
                            style={{
                                width: '30%',
                            }}
                            size="large"
                            onChange={(value => {setSearchByField(value)})}
                        >
                            <Option value="name">Назва</Option>
                            <Option value="brand">Модель</Option>
                        </Select>
                    </div>
                    <div>
                        Кількість місць
                        <Row>
                            <Slider
                                min={1}
                                max={12}
                                marks={{1: '1', 12: '12'}}
                                onChange={(value => {setValueNumberPeople(value)})}
                                value={typeof valueNumberPeople === 'number' ? valueNumberPeople : 1}
                                style={{ width: '100%', background: "white"}}
                            />
                        </Row>
                    </div>
                    <div>
                        Рік виготовлення
                        <Row>
                            <Slider
                                range
                                marks={{
                                    [new Date().getFullYear() - 30]: new Date().getFullYear() - 30,
                                    [new Date().getFullYear()]: new Date().getFullYear()
                                }}
                                min={new Date().getFullYear() - 30}
                                max={new Date().getFullYear()}
                                value={[valueModelYear.from, valueModelYear.to]}
                                onChange={(value => {setValueModelYear({from: value[0], to: value[1]})})}
                                style={{ width: '100%', background: "white"}}
                            />
                        </Row>
                    </div>
                </div>
                <div className={classes.filters__block__right}>
                    <div className={classes.block__right__rating}>
                        <div className={classes.block__right__title}>Рейтинг: </div>
                        <Rate tooltips={ratingDescription} onChange={setValueRating} value={valueRating}/>
                    </div>
                    <div>
                        <div className={classes.block__right__select__title}>
                            Статус
                        </div>
                        <Select
                            style={{
                                width: '200px',
                            }}
                            defaultValue="any"
                            size="large"
                            value={valueStatus}
                            onChange={setValueStatus}
                        >
                            <Select.Option value="any">Будь-який</Select.Option>
                            <Select.Option value="false">На паркінгу</Select.Option>
                            <Select.Option value="true">В прокаті</Select.Option>
                        </Select>
                        </div>
                    <div>
                        <div className={classes.block__right__select__title}>
                            Колір
                        </div>
                        <Select
                            style={{
                                width: '200px',
                            }}
                            defaultValue="any"
                            size="large"
                            value={selectColor}
                            onChange={setSelectColor}
                        >
                            <Select.Option value="any">Будь-який</Select.Option>
                            {carColor?.map((carType) =>
                                <Select.Option value={carType}>{carType}</Select.Option>
                            )}
                        </Select>
                    </div>
                    <div>
                        <div>
                            Тип автомобіля
                        </div>
                        <Select
                            style={{
                                width: '200px',
                            }}
                            value={selectType}
                            onChange={setSelectType}
                            size="large"
                        >
                            <Select.Option value="any">Будь-який</Select.Option>
                            {carTypes?.map((carType) =>
                                <Select.Option value={carType.type}>{carType.type}</Select.Option>
                            )}
                        </Select>
                    </div>
                </div>
                <Button icon={<SearchOutlined />} size="large" onClick={search}>Пошук</Button>
                <Button icon={<RetweetOutlined />} size="large" onClick={resetFilterForm}>Cкинути</Button>
            </div>
            <Table
                columns={columns(onDeleteCar, navigate)}
                dataSource={dataSource}
                pagination={{
                    total: totalPages,
                    current: params.skip,
                    pageSize: params.limit
                }}
                onChange={handleTableChange}
            >
            </Table>
        </div>
    );
};

export default CarsPage;