import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Button, DatePicker, Form, Image, Input, message, Select} from "antd";
import moment from "moment";
import {ArrowLeftOutlined, DeleteOutlined} from "@ant-design/icons";
import classes from "../Car/CarCreatePage.module.css";
import PasswordDataService from "../../services/PasswordDataService";

const PassportDataEditPage = () => {
    let navigate = useNavigate();
    const {id} = useParams();

    const [form] = Form.useForm();
    const [files, setFiles] = useState(null);

    const [images, setImages] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const fetchCar = () => {
        PasswordDataService.fetchPassportDataById(id)
            .then((response) => {
                response = response.passportsData;
                setImages(response.imageLink);

                form.setFieldsValue({
                    firstname: response.firstname,
                    secondName: response.secondName,
                    lastname: response.lastname,
                    phoneNumber: response.phoneNumber,
                    sex: response.sex,
                    birthdate: response.birthdate ? moment(response.birthdate, 'YYYY-MM-DD') : ''
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
        fetchCar();
    }, [])

    const onFinishEditPassportData = (value) => {
        setIsLoading(true);
        let formCarData = new FormData();

        value.birthdate = value.birthdate.format('YYYY-MM-DD');
        formCarData.append("birthdate", value.birthdate)
        delete value.birthdate;

        for (const valueKey in value) {
            formCarData.append(valueKey, value[valueKey]);
        }

        const formImageData = new FormData()
        if (files) {
            for (let i = 0; i < files.length; i++) {
                formImageData.append('imageLink', files[i]);
            }
        }

        PasswordDataService.editPassportData(id, formCarData)
            .then((response) => {
                PasswordDataService.addPhotos(id, formImageData)
                    .then((response) => {
                        navigate(-1);
                        setIsLoading(false);
                    })
            })
            .catch((error) => {
                messageError(error);
            })

    }

    const onDeleteImagePassport = (idImage) => {
        PasswordDataService.deletePhoto(id, idImage)
            .then(() => {
                fetchCar();
                message.success('Документ успішно видалено')
            })
            .catch((error) => {
                messageError(error);
            })
    }

    const fileSelectedHandler = (event) => {
        setFiles(event.target.files);
    }

    const messageError = (error) => {
        let messageText = error?.response?.data?.message;
        if (error?.response?.data?.errors[0]?.msg !== undefined) {
            messageText = error?.response?.data?.errors[0]?.msg;
        }
        message.error(messageText)
        setIsLoading(false);
    }

    return (
        <div>
            <Button onClick={() => {navigate(-1)}}><ArrowLeftOutlined />Повернутися назад</Button>
            <h1 className={classes.h1}>Редагування даних автомобіля</h1>
            <Form
                form={form}
                style={{ width: '400px' }}
                name="create_passport"
                layout="vertical"
                autoComplete="off"
                onFinish={onFinishEditPassportData}
            >
                <Form.Item
                    name="firstname"
                    label="Ім'я"
                    rules={[
                        {
                            required:true,
                            message:'Будь ласка, введіть ім\'я'
                        },
                    ]}
                    hasFeedback
                >
                    <Input
                        placeholder="Ім'я..."
                    />
                </Form.Item>
                <Form.Item
                    name="lastname"
                    label="Прізвище"
                    rules={[
                        {
                            required:true,
                            message:'Будь ласка, введіть прізвище'
                        },
                    ]}
                    hasFeedback
                >
                    <Input
                        placeholder="Прізвище..."
                    />
                </Form.Item>
                <Form.Item
                    name="secondName"
                    label="По батькові"
                    rules={[
                        {
                            required: true,
                            message:'Будь ласка, заповніть це поле'
                        }
                    ]}
                    hasFeedback
                >
                    <Input
                        placeholder="По батькові..."
                    />
                </Form.Item>
                <Form.Item
                    name="phoneNumber"
                    label="Номер телефону"
                    rules={[
                        {
                            required: true,
                            message:'Будь ласка, введіть номер телефону'
                        }
                    ]}
                    hasFeedback
                >
                    <Input
                        placeholder="+380..."
                    />
                </Form.Item>
                <Form.Item
                    name="sex"
                    label="Стать"
                    rules={[
                        {
                            required:true,
                            message: 'Будь ласка, введіть стать'
                        },
                    ]}
                >
                    <Select placeholder={"..."}>
                        <Select.Option value="Чоловіча">Чоловіча</Select.Option>
                        <Select.Option value="Жіноча">Жіноча</Select.Option>
                        <Select.Option value="Інша">Інша</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="birthdate" label="Дата народження">
                    <DatePicker/>
                </Form.Item>
                <Form.Item
                    label="Фото"
                >
                    <div>
                        <Image.PreviewGroup>
                            {images?.map((image) =>
                                <div>
                                    <Image width={100} src={image.imageLink}/>
                                    <DeleteOutlined
                                        onClick={() => {onDeleteImagePassport(image._id)}}
                                        style={{color: '#d02828', marginLeft: 12, fontSize: '15px'}}
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

export default PassportDataEditPage;