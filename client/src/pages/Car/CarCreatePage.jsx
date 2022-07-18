import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Form, Input, InputNumber, Select, message} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import CarTypeService from "../../services/CarTypeService";
import {CarService} from "../../services/CarService";
import classes from "./CarCreatePage.module.css";

const CarCreatePage = () => {
    let navigate = useNavigate()
    const [files, setFiles] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onFinishCreateCar = (value) => {
        setIsLoading(true);
        let formData = new FormData();

        value.modelYear = value.modelYear.format('YYYY');
        formData.append("modelYear", value.modelYear)
        delete value.modelYear;

        for (const valueKey in value) {
            formData.append(valueKey, value[valueKey]);
        }


        if (files) {
            for (let i = 0; i < files.length; i++) {
                formData.append('photos', files[i]);
            }
        }

        CarService.createCars(formData)
            .then((response) => {
                navigate(-1);
                setIsLoading(false);
            })
            .catch((error) => {
                let messageText = error?.response?.data?.message;
                if (error?.response?.data?.errors[0]?.msg !== undefined) {
                    messageText = error?.response?.data?.errors[0]?.msg;
                }

                message.error(messageText)
                setIsLoading(false);
            })
    }

    const [carTypes, setCarTypes] = useState([]);
    useEffect(() => {
        CarTypeService.fetchCarTypes()
            .then((response) => {
                setCarTypes(response.carTypes)
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])


    const fileSelectedHandler = (event) => {
        setFiles(event.target.files);
    }

    return (
        <div>
            <Button onClick={() => {navigate(-1)}}><ArrowLeftOutlined />Повернутися назад</Button>
            <h1 className={classes.h1}>Форма створення запису про автомобіль</h1>
            <Form
                style={{ width: '400px' }}
                name="create_car"
                layout="vertical"
                autoComplete="off"
                onFinish={onFinishCreateCar}
                initialValues={{
                    ["numberPeople"]: 4
                }}
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
                <Form.Item
                    name="price"
                    label="Вартість оренди"
                    rules={[
                        {
                            required: true,
                            message:'Будь ласка, введіть вартість оренди автомобіля'
                        }
                    ]}
                    hasFeedback
                >
                    <InputNumber min={1} style={{width: '100%'}}/>
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
                        onChange={fileSelectedHandler}
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
                        {carTypes.map((carType) =>
                            <Select.Option value={carType._id}>{carType.type}</Select.Option>
                        )}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button
                        block
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                    >
                        Створити
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CarCreatePage;