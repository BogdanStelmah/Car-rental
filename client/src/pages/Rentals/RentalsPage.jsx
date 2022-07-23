import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Form, Input, message, Modal, Rate, Row, Select, Table} from "antd";
import {queryParser} from "../../components/utils/queryParser";
import RentalService from "../../services/RentalService";
import {columns} from "../../columns/rentalColumns";
import TextArea from "antd/es/input/TextArea";
import {ReviewsService} from "../../services/ReviewsService";
import {Option} from "antd/es/mentions";
import {RetweetOutlined, SearchOutlined} from "@ant-design/icons";
import classes from "./RentalsPage.module.css";
import RentalStatistics from "../../components/DiagramsRental/rentalStatistics";
const { RangePicker } = DatePicker;

const RentalsPage = () => {
    const [dataSource, setDataSource] = useState();
    const [totalPages, setTotalPages] = useState(0);
    const [params, setParams] = useState({
        skip: 1,
        limit: 8
    });
    const [isEndRental, setIsEndRental] = useState(false);
    const [form] = Form.useForm();
    const [endRental, setEndRental] = useState();

    const ratingDescription = ['жахливо', 'погано', 'нормально', 'добре', 'чудово'];

    const [searchText, setSearchText] = useState(null)
    const [searchByField, setSearchByField] = useState('car.name');
    const [dateRental, setDateRental] = useState();
    const [returnDate, setReturnDate] = useState();
    const [statusRental, setStatusRental] = useState('any');
    const [filtersParams, setFiltersParams] = useState({});

    const search = () => {
        const data = {}

        if (searchText) {
            data[searchByField] = searchText;
        }
        if (statusRental !== 'any') {
            data["status"] = statusRental;
        }
        if (dateRental) {
            data["createdAt"] = dateRental[0].format('YYYY-MM-DD') + "to" + dateRental[1].format('YYYY-MM-DD')
        }
        if (returnDate) {
            data["returnDate"] = returnDate[0].format('YYYY-MM-DD') + "to" + returnDate[1].format('YYYY-MM-DD')
        }

        setFiltersParams({...data});
        setParams({...params, skip: 1})
    }

    const resetFilters = () => {
        setSearchText(null);
        setSearchByField('car.name');
        setDateRental();
        setReturnDate();
        setStatusRental('any');
        setFiltersParams({});
    }

    const getRental = () => {
        RentalService.fetchRentals({...params, ...filtersParams}).then((response) => {
            setTotalPages(response?.totalCount)
            setDataSource(response?.rentals);
        })
    }

    useEffect(() => {
        getRental();
    }, [params, filtersParams])

    const handleTableChange = (newPagination, filters, sorter) => {
        const newParams = queryParser(newPagination, filters, sorter)
        setParams({...newParams});
    }

    const onDeleteRental = (record) => {
        Modal.confirm({
            title: "Ви впевнені, що хочете видалити це замовлення?",
            okText: "Так",
            okType: "danger",
            cancelText: "Відміна",
            onOk: () => {
                RentalService.deleteRental(record._id)
                    .then(() => {
                        message.success('Успішно видалено')
                        getRental();
                    });
            }
        });
    }

    const onEndRental = (record) => {
        setEndRental(record);
        setIsEndRental(true);
    }


    const onFinishEndRental = (value) => {
        const sendRequest = () => {
            RentalService.endRental(endRental._id)
                .then(() => {
                    message.success('Оренду закінчено')
                    getRental();
                })
                .catch((error) => {
                    messageError(error);
                })
                .finally(() => {
                    setIsEndRental(false);
                })
        }

        let isAddReview = true;
        if (value.rating || value.content) {
            isAddReview = false;
            const data = {}
            for (const valueKey in value) {
                data[valueKey] = value[valueKey];
            }

            data["customer"] = endRental.user[0]._id;

            ReviewsService.addReviewCar(endRental.car[0]._id, data)
                .then(() => {
                    message.success('Відгук додано')
                    sendRequest()
                })
                .catch((error) => {
                    messageError(error);
                })
        }
        if (isAddReview) {
            sendRequest()
        }
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
            <div className={classes.block__filters}>
                <div>
                    <Input
                        allowClear
                        placeholder="Пошук"
                        size='large'
                        value={searchText}
                        style={{width: '50%'}}
                        onChange={(e) => {setSearchText(e.target.value)}}
                    />
                    <Select
                        defaultValue="car.name"
                        value={searchByField}
                        style={{
                            width: '50%',
                        }}
                        size="large"
                        onChange={(value => {setSearchByField(value)})}
                    >
                        <Option value="car.name">Назва автомобіля</Option>
                        <Option value="car.number">Автомобільний номер</Option>
                    </Select>
                </div>
                <div>
                    Дата оренди
                    <Row>
                        <RangePicker value={dateRental} style={{width: '100%'}} size="large" onChange={(e) => {setDateRental(e)}}/>
                    </Row>
                </div>
                <div>
                    Дата повернення
                    <Row>
                        <RangePicker value={returnDate} style={{width: '100%'}} size="large"  onChange={(e) => {setReturnDate(e)}}/>
                    </Row>
                </div>
                <div>
                    <div>
                        Статус оренди
                    </div>
                    <Select
                        style={{
                            width: '50%',
                        }}
                        defaultValue="any"
                        size="large"
                        value={statusRental}
                        onChange={setStatusRental}
                    >
                        <Select.Option value="any">Будь-який</Select.Option>
                        <Select.Option value="true">Закінчено</Select.Option>
                        <Select.Option value="false">В оренді</Select.Option>
                    </Select>
                    <Button icon={<SearchOutlined />} size="large" style={{width: '25%'}} onClick={search}>Пошук</Button>
                    <Button icon={<RetweetOutlined />} size="large" style={{width: '25%'}} onClick={resetFilters}>Cкинути</Button>
                </div>
            </div>

            <Table
                scroll={{
                    x: 2000,
                }}
                columns={columns(onDeleteRental, onEndRental)}
                dataSource={dataSource}
                pagination={{
                    total: totalPages,
                    current: params.skip,
                    pageSize: params.limit
                }}
                onChange={handleTableChange}
            >
            </Table>

            <Modal
                title='Завершення оренди'
                visible={isEndRental}
                okText="Відправити"
                cancelText="Відміна"
                onCancel={() => {
                    setIsEndRental(false);
                    form.resetFields();
                }}
                onOk={() => {
                    form.submit();
                }}
            >
                <Form
                    form={form}
                    labelCol={{ span: 8 }}
                    layout="vertical"
                    onFinish={onFinishEndRental}
                >
                    <Form.Item label="Відгук" name="content">
                        <TextArea maxLength={100} rows={3}/>
                    </Form.Item>
                    <Form.Item
                        label="Загальні враження"
                        name="rating"
                    >
                        <Rate tooltips={ratingDescription}/>
                    </Form.Item>
                </Form>
            </Modal>
            <RentalStatistics/>
        </div>
    );
};

export default RentalsPage;