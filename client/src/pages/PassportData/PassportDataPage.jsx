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

    const [isLoadingTable, setIsLoadingTable] = useState(true)

    const [dataSource, setDataSource] = useState();
    const [totalPages, setTotalPages] = useState(0);
    const [params, setParams] = useState({
        skip: 1,
        limit: 6
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
        setIsLoadingTable(true);
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
                setIsLoadingTable(false)
            })
    }

    useEffect(() => {
        getPassportData();
    }, [params, filtersParams])

    const handleTableChange = (newPagination, filters, sorter) => {
        setIsLoadingTable(true);
        const newParams = queryParser(newPagination, filters, sorter)
        setParams({...newParams});
    }

    const onDeleteType = (record) => {
        Modal.confirm({
            title: "???? ????????????????, ???? ???????????? ???????????????? ?????????? ???????????????????????",
            okText: "??????",
            okType: "danger",
            cancelText: "??????????????",
            onOk: () => {
                setIsLoadingTable(true)
                PasswordDataService.deletePassportData(record._id)
                    .then(() => {
                        message.success('?????????????? ????????????????')
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
            <Button onClick={() => navigate(ADMIN_ROUTE + "/" + PASSPORT_DATA_CREATE_ROUTER)} style={{marginBottom: 10}} >???????????? ??????????????????????</Button>
            <div className={classes.block__filters}>
                <div>
                    <Input
                        allowClear
                        placeholder="??????????..."
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
                        <Option value="firstname">????'??</Option>
                        <Option value="lastname">????????????????</Option>
                        <Option value="secondName">???? ????????????????</Option>
                        <Option value="phoneNumber">?????????? ????????????????</Option>
                    </Select>
                </div>
                <div>
                    <div>
                        ??????????
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
                        <Select.Option value="any">????????-????a</Select.Option>
                        <Select.Option value="??????????????">????????????????</Select.Option>
                        <Select.Option value="??????????">????????????</Select.Option>
                        <Select.Option value="????????">????????</Select.Option>
                    </Select>
                </div>
                <div>
                    <div>
                        ???????? ????????????????????
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
                    <Button icon={<SearchOutlined />} size="large" style={{width: '130px'}} onClick={search}>??????????</Button>
                    <Button icon={<RetweetOutlined />} size="large" style={{width: '130px'}} onClick={resetFilters}>C????????????</Button>
                </div>
            </div>
            <Table
                loading={isLoadingTable}
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