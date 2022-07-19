import React, {useEffect, useState} from 'react';
import {Form, message, Modal, Rate, Table} from "antd";
import {queryParser} from "../../components/utils/queryParser";
import RentalService from "../../services/RentalService";
import {columns} from "../../columns/rentalColumns";
import TextArea from "antd/es/input/TextArea";
import {ReviewsService} from "../../services/ReviewsService";

const RentalsPage = () => {
    const [dataSource, setDataSource] = useState();
    const [totalPages, setTotalPages] = useState(0);
    const [params, setParams] = useState({
        skip: 1,
        limit: 5
    });
    const [isEndRental, setIsEndRental] = useState(false);
    const [form] = Form.useForm();
    const [endRental, setEndRental] = useState();

    const ratingDescription = ['жахливо', 'погано', 'нормально', 'добре', 'чудово'];

    const getRental = () => {
        RentalService.fetchRentals({...params}).then((response) => {
            setTotalPages(response?.totalCount)
            setDataSource(response?.rentals);
        })
    }

    useEffect(() => {
        getRental();
    }, [params])

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
        </div>
    );
};

export default RentalsPage;