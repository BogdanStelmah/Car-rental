import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Form, Image, Input, InputNumber, message, Select} from "antd";
import {ArrowLeftOutlined, DeleteOutlined} from "@ant-design/icons";
import classes from "./CarCreatePage.module.css";
import TextArea from "antd/es/input/TextArea";
import {useNavigate, useParams} from "react-router-dom";
import {CarService} from "../../services/CarService";
import moment from 'moment';
import CarTypeService from "../../services/CarTypeService";

const CarEdit = () => {
    let navigate = useNavigate();
    const {id} = useParams();

    const [form] = Form.useForm();
    const [files, setFiles] = useState(null);

    const [carTypes, setCarTypes] = useState([]);
    const [carImages, setCarImages] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const fetchCar = () => {
        CarService.fetchCar(id)
            .then((response) => {
                setCarImages(response.car?.carImages);

                form.setFieldsValue({
                    name: response.car.name,
                    brand: response.car.brand,
                    modelYear: moment(response.car.modelYear, 'YYYY'),
                    price: response.car.price,
                    description: response.car.description,
                    color: response.car.color,
                    numberPeople: response.car.numberPeople,
                    number: response.car.number,
                    carType: response.car.carType._id
                })
            })
            .catch((error) => {
                let messageText = error?.response?.data?.message;
                if (error?.response?.data?.errors[0]?.msg !== undefined) {
                    messageText = error?.response?.data?.errors[0]?.msg;
                }

                message.error(messageText)
            })
    }

    useEffect(() => {
        CarTypeService.fetchCarTypes()
            .then((response) => {
                setCarTypes(response.carTypes)
            })
            .catch((error) => {
                console.log(error);
            })
        fetchCar();
    }, [])

    const onFinishEditCar = (value) => {
        setIsLoading(true);
        let formCarData = new FormData();

        value.modelYear = value.modelYear.format('YYYY');
        formCarData.append("modelYear", value.modelYear)
        delete value.modelYear;

        for (const valueKey in value) {
            formCarData.append(valueKey, value[valueKey]);
        }

        const formImageData = new FormData()
        if (files) {
            for (let i = 0; i < files.length; i++) {
                formImageData.append('photos', files[i]);
            }
        }

        CarService.editCar(id, formCarData)
            .then((response) => {
                CarService.addPhotos(id, formImageData)
            })
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

    const onDeleteImageCar = (idImage) => {
        CarService.deletePhoto(id, idImage)
            .then(() => {
                fetchCar();
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

    const fileSelectedHandler = (event) => {
        setFiles(event.target.files);
    }

    return (
        <div>
            <Button onClick={() => {navigate(-1)}}><ArrowLeftOutlined />Повернутися назад</Button>
            <h1 className={classes.h1}>Редагування даних автомобіля</h1>
            <Form
                form={form}
                style={{ width: '400px' }}
                name="create_car"
                layout="vertical"
                autoComplete="off"
                onFinish={onFinishEditCar}
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
                <Form.Item name="description" label="Опис"
                    rules={[
                        { required: true, message: 'Мінімальна довжина 10 символів' },
                        { min: 10, message: 'Мінімальна довжина 10 символів'},
                        { max: 500, message: 'Максимальна довжина 500 символів' }
                    ]}
                >
                    <TextArea rows={4} style={{height: '250px'}}/>
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
                    <div>
                        <Image.PreviewGroup>
                            {carImages?.map((image) =>
                                <div>
                                    <Image width={300} src={image.imageLink}/>
                                    <DeleteOutlined
                                        onClick={() => {onDeleteImageCar(image._id)}}
                                        style={{color: '#d02828', marginLeft: 12, fontSize: '20px'}}
                                    />
                                </div>
                            )}
                        </Image.PreviewGroup>
                    </div>
                </Form.Item>
                <Form.Item
                    label="Додати фото"
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
                        Оновити
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CarEdit;