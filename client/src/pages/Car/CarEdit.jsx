import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Form, Input, InputNumber, message, Select} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import classes from "./CarCreatePage.module.css";
import TextArea from "antd/es/input/TextArea";
import {useNavigate, useParams} from "react-router-dom";
import {CarService} from "../../services/CarService";

const CarEdit = () => {
    let navigate = useNavigate();
    const {id} = useParams();

    const [carData, setCarData] = useState(null);

    useEffect(() => {
        CarService.fetchCar(id)
            .then((response) => {
                setCarData(response.car);
            })
            .catch((error) => {
                let messageText = error?.response?.data?.message;
                if (error?.response?.data?.errors[0]?.msg !== undefined) {
                    messageText = error?.response?.data?.errors[0]?.msg;
                }

                message.error(messageText)
            })
    }, [])

    return (
        <div>
            <Button onClick={() => {navigate(-1)}}><ArrowLeftOutlined />Повернутися назад</Button>
            <h1 className={classes.h1}>Редагування даних автомобіля</h1>
            <Form
                style={{ width: '400px' }}
                name="create_car"
                layout="vertical"
                autoComplete="off"
                // onFinish={onFinishCreateCar}
            >
                <Form.Item
                    name="name"
                    label="Назва"
                    rules={[
                        {
                            required:true,
                            message:'Будь ласка, введіть назву автомобіля'
                        },
                    ]}
                    hasFeedback
                >
                    <Input
                        placeholder="Ім'я..."
                        value={carData?.name}
                    />
                </Form.Item>
                <Form.Item
                    name="brand"
                    label="Модель"
                    rules={[
                        {
                            required:true,
                            message:'Будь ласка, введіть модель автомобіля'
                        },
                    ]}
                    hasFeedback
                >
                    <Input
                        placeholder="Модель..."
                    />
                </Form.Item>
                <Form.Item
                    name="modelYear"
                    label="Рік випуску автомобіля"
                    rules={[
                        {
                            required: true,
                            message:'Будь ласка, введіть рік випуску автомобіля'
                        }
                    ]}
                    hasFeedback
                >
                    <DatePicker picker="year"/>
                </Form.Item>
                <Form.Item name="description" label="Опис">
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    name="color"
                    label="Колір"
                    rules={[
                        {
                            required:true,
                            message:'Будь ласка, введіть колір автомобіля'
                        },
                    ]}
                    hasFeedback
                >
                    <Input
                        placeholder="Колір..."
                    />
                </Form.Item>
                <Form.Item
                    name="numberPeople"
                    label="Кількість місць"
                >
                    <InputNumber min={1} max={12}/>
                </Form.Item>
                <Form.Item
                    name="number"
                    label="Автомобільний номер"
                    rules={[
                        {
                            required:true,
                            message:'Будь ласка, введіть автомобільний номер'
                        },
                    ]}
                    hasFeedback
                >
                    <Input
                        placeholder="XX 0000 XX"
                    />
                </Form.Item>
                <Form.Item
                    label="Фото"
                >
                    <Input
                        multiple
                        type="file"
                        // onChange={fileSelectedHandler}
                    />
                </Form.Item>
                <Form.Item
                    name="carType"
                    label="Тип автомобіля"
                    rules={[
                        {
                            required:true,
                            message:'Будь ласка, виберіть тип автомобіля'
                        },
                    ]}
                >
                    <Select placeholder="Тип...">
                        {/*{carTypes.map((carType) =>*/}
                        {/*    <Select.Option value={carType._id}>{carType.type}</Select.Option>*/}
                        {/*)}*/}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button
                        block
                        type="primary"
                        htmlType="submit"
                        // loading={isLoading}
                    >
                        Оновити
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CarEdit;