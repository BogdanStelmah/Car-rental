import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Input, message, Modal, Row, Select, Table} from "antd";
import {queryParser} from "../../components/utils/queryParser";
import PasswordDataService from "../../services/PasswordDataService";
import {columns} from "../../columns/passportDataColumns";
import {ADMIN_ROUTE, PASSPORT_DATA_CREATE_ROUTER} from "../../components/utils/consts";
import {useNavigate} from "react-router-dom";
import classes from "./PassportData.module.css";
import {Option} from "antd/es/mentions";
import {RetweetOutlined, SearchOutlined} from "@ant-design/icons";

const PassportDataPage = () => {
    const navigate = useNavigate();

    const [dataSource, setDataSource] = useState();
    const [totalPages, setTotalPages] = useState(0);
    const [params, setParams] = useState({
        skip: 1,
        limit: 5
    });

    const [searchText, setSearchText] = useState(null)
    const [searchByField, setSearchByField] = useState('lastname');
    const [sex, setSex] = useState('any');
    const [birthdate, setBirthdate] = useState();
    const [filtersParams, setFiltersParams] = useState({});

    const search = () => {
        const data = {}

        if (searchText) {
            data[searchByField] = searchText;
        }
        if (sex !== 'any') {
            data["sex"] = sex;
        }
        if (birthdate) {
            data['birthdate'] = birthdate.format('YYYY-MM-DD')
        }

        setFiltersParams({...data});
        setParams({...params, skip: 1})
    }

    const resetFilters = () => {
        setSearchText(null);
        setSearchByField('lastname');
        setSex('any');
        setBirthdate();
        setFiltersParams({});
    }

    const getPassportData = () => {
        PasswordDataService.fetchPassportData({...params, ...filtersParams})
            .then((response) => {
                setTotalPages(response?.totalCount)
                setDataSource(response?.passportsData);
            })
    }

    useEffect(() => {
        getPassportData();
    }, [params, filtersParams])

    const handleTableChange = (newPagination, filters, sorter) => {
        const newParams = queryParser(newPagination, filters, sorter)
        setParams({...newParams});
    }

    const onDeleteType = (record) => {
        Modal.confirm({
            title: "Ви впевнені, що хочете видалити цього користувача?",
            okText: "Так",
            okType: "danger",
            cancelText: "Відміна",
            onOk: () => {
                PasswordDataService.deletePassportData(record._id)
                    .then(() => {
                        message.success('Успішно видалено')
                        getPassportData();
                    })
                    .catch((error) => {
                        messageError(error);
                    })
            }
        });
    }

    const messageError = (error) => {
        let messageText = error?.response?.data?.message;
        if (error?.response?.data?.errors[0]?.msg !== undefined) {
            messageText = error?.response?.data?.errors[0]?.msg;
        }
        message.error(messageText)
    }

    return (
        <div>
            <Button onClick={() => navigate(ADMIN_ROUTE + "/" + PASSPORT_DATA_CREATE_ROUTER)} style={{marginBottom: 10}} >Додати користувача</Button>
            <div className={classes.block__filters}>
                <div>
                    <Input
                        allowClear
                        placeholder="Пошук..."
                        size='large'
                        value={searchText}
                        style={{width: '60%'}}
                        onChange={(e) => {setSearchText(e.target.value)}}
                    />
                    <Select
                        value={searchByField}
                        style={{
                            width: '40%',
                        }}
                        size="large"
                        onChange={(value => {setSearchByField(value)})}
                    >
                        <Option value="firstname">Ім'я</Option>
                        <Option value="lastname">Прізвище</Option>
                        <Option value="secondName">По батькові</Option>
                        <Option value="phoneNumber">Номер телефону</Option>
                    </Select>
                </div>
                <div>
                    <div>
                        Стать
                    </div>
                    <Select
                        style={{
                            width: '150px',
                        }}
                        defaultValue="any"
                        size="large"
                        value={sex}
                        onChange={setSex}
                    >
                        <Select.Option value="any">Будь-якa</Select.Option>
                        <Select.Option value="Чоловік">Чоловіча</Select.Option>
                        <Select.Option value="Жінка">Жіноча</Select.Option>
                        <Select.Option value="Інше">Інша</Select.Option>
                    </Select>
                </div>
                <div>
                    <div>
                        Дата народження
                    </div>
                    <DatePicker
                        size="large"
                        style={{
                            width: '150px',
                        }}
                        value={birthdate}
                        onChange={(value => {setBirthdate(value)})}
                    />
                </div>
                <div>
                    <Button icon={<SearchOutlined />} size="large" style={{width: '130px'}} onClick={search}>Пошук</Button>
                    <Button icon={<RetweetOutlined />} size="large" style={{width: '130px'}} onClick={resetFilters}>Cкинути</Button>
                </div>
            </div>
            <Table
                columns={columns(onDeleteType, navigate)}
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

export default PassportDataPage;