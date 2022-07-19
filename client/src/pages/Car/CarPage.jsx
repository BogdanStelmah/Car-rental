import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {CarService} from "../../services/CarService";
import {Button, Carousel, Checkbox, Form, Input, InputNumber, message, Modal, Rate, Select} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import classes from './CarCreatePage.module.css';
import {ReviewsService} from "../../services/ReviewsService";
import PasswordDataService from "../../services/PasswordDataService";
import RentalService from "../../services/RentalService";

const CarPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const {id} = useParams();
    const [car, setCar] = useState(null);
    const [carReviews, setCarReviews] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [passportsData, serPassportsData] = useState(null);

    useEffect(() => {
        CarService.fetchCar(id)
            .then((response) => {
                setCar(response.car);
            })
            .catch((error) => {
                let messageText = error?.response?.data?.message;
                if (error?.response?.data?.errors[0]?.msg !== undefined) {
                    messageText = error?.response?.data?.errors[0]?.msg;
                }

                message.error(messageText)
            })

        ReviewsService.fetchReviewsCar(id)
            .then((response) => {
                setCarReviews(response?.review);
            })
    }, [])

    const registrationRental = () => {
        PasswordDataService.fetchPassportData()
            .then((response) => {
                serPassportsData(response.passportsData)
            })
        form.setFieldsValue({"rentalPeriod": 1});
        setIsModalVisible(true);
    }

    const createRental = (value) => {
        setIsModalVisible(false)

        const data = {}
        data.car = car._id

        for (const valueKey in value) {
            data[valueKey] = value[valueKey];
        }

        RentalService.createRental(data)
            .then((response) => {
                message.success('Оформлення пройшло успішно')

            })
            .catch((error) => {
                let messageText = error?.response?.data?.message;
                if (error?.response?.data?.errors[0]?.msg !== undefined) {
                    messageText = error?.response?.data?.errors[0]?.msg;
                }

                message.error(messageText)
            })
    }

    return (
        <div>
            <Button onClick={() => {navigate(-1)}}><ArrowLeftOutlined />Повернутися назад</Button>
            <div className={classes.content__car}>
                { car?.carImages?.length !== 1
                    ? <Carousel autoplay style={{width: '600px', marginRight: '10px'}}>
                        {car?.carImages?.map((image) =>
                            <div>
                                <img src={image.imageLink} style={{width: '600px'}}/>
                            </div>
                        )}
                    </Carousel>
                    : <div style={{width: '600px', marginRight: '10px'}}>
                        {car?.carImages?.map((image) =>
                            <div>
                                <img src={image.imageLink} style={{width: '600px'}}/>
                            </div>
                        )}
                    </div>
                }

                <div className={classes.car__info}>
                    <h1 className={classes.car__title}>{car?.name}</h1>
                    <p className={classes.car__characteristic}>Характеристики</p>
                    <div className={classes.car__characteristics}>
                        <div><span>Бренд: </span>{car?.brand}</div>
                        <div><span>Рейтинг: </span><Rate disabled allowHalf value={car?.rating}/></div>
                        <div><span>Рік виготовлення: </span>{car?.modelYear}</div>
                        <div><span>Тип: </span>{car?.carType?.type}</div>
                        <div><span>Опис: </span>{car?.description}</div>
                        <div><span>Колір: </span>{car?.color}</div>
                        <div><span>Кількість місць: </span>{car?.numberPeople}</div>
                        <div><span>Номер: </span>{car?.number}</div>
                        <div>
                            <span>Статус: </span>
                            {car?.status
                            ? 'В прокаті'
                                : 'На паркінгу'
                            }
                        </div>
                        <div><span>Вартість оренди: </span>{car?.price}</div>
                    </div>
                    <div>
                        {!car?.status &&
                        <Button onClick={() => {
                            registrationRental()
                        }}>
                            Оформити оренду
                        </Button>
                        }

                    </div>
                </div>

                <div className={classes.reviews__car}>
                    <h1>Відгуки</h1>
                    <div className={classes.reviews__list}>
                        {carReviews?.map((review) =>
                            <div className={classes.review}>
                                <div><b>{review?.user?.firstname}</b></div>
                                <div><Rate disabled allowHalf value={review.rating}/></div>
                                <div>{review.content}</div>
                                <div>{review.createdAt.split('T')[0]}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                title='Оформлення оренди'
                visible={isModalVisible}
                okText="Оформити"
                cancelText="Відміна"
                getContainer={false}
                onCancel={() => {
                    setIsModalVisible(false)
                }}
                onOk={() => {
                    form.submit();
                }}
            >
                <Form
                    labelCol={{ span: 6 }}
                    layout="vertical"
                    form={form}
                    onFinish={createRental}
                >
                    <Form.Item
                        label="Паспортні дані"
                        name="passportData"
                        rules={[
                            {
                                required: true,
                                message:'Будь ласка, виберіть орендатора'
                            }
                        ]}

                    >
                        <Select
                            showSearch
                            placeholder="Виберіть людину"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.join('').toLowerCase().includes(input.toLowerCase())}
                        >
                            {passportsData
                            ?   <>
                                    {passportsData.map((data) =>
                                        <Select.Option value={data._id}>{data?.lastname} {data?.firstname} {data?.secondName}</Select.Option>
                                    )}
                                </>
                            :   <>
                                    <Select.Option disabled>Дані відсутні</Select.Option>
                                </>
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="Кількість днів" name="rentalPeriod">
                        <InputNumber min={1}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CarPage;