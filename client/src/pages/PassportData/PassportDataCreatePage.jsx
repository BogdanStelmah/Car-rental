import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {CarService} from "../../services/CarService";
import {Button, DatePicker, Form, Input, InputNumber, message, Select} from "antd";
import CarTypeService from "../../services/CarTypeService";
import {ArrowLeftOutlined} from "@ant-design/icons";
import classes from "../Car/CarCreatePage.module.css";
import TextArea from "antd/es/input/TextArea";
import PasswordDataService from "../../services/PasswordDataService";

const PassportDataCreatePage = () => {
    let navigate = useNavigate()
    const [files, setFiles] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onFinishCreatePassportData = (value) => {
        setIsLoading(true);
        let formData = new FormData();

        value.birthdate = value.birthdate.format('YYYY-MM-DD');
        formData.append("birthdate", value.birthdate)
        delete value.birthdate;

        for (const valueKey in value) {
            formData.append(valueKey, value[valueKey]);
        }


        if (files) {
            for (let i = 0; i < files.length; i++) {
                formData.append('imageLink', files[i]);
            }
        }

        PasswordDataService.createPassportData(formData)
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

    const fileSelectedHandler = (event) => {
        setFiles(event.target.files);
    }

    return (
        <div>
            <Button onClick={() => {navigate(-1)}}><ArrowLeftOutlined />Повернутися назад</Button>
            <h1 className={classes.h1}>Форма створення паспортних даних</h1>
            <Form
                style={{ width: '400px' }}
                name="create_passport"
                layout="vertical"
                autoComplete="off"
                onFinish={onFinishCreatePassportData}
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
                    name="secondName"
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
                    name="lastname"
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
                        <Select.Option value="Чоловік">Чоловіча</Select.Option>
                        <Select.Option value="Жінка">Жіноча</Select.Option>
                        <Select.Option value="Інше">Інша</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="birthdate" label="Дата народження">
                    <DatePicker/>
                </Form.Item>

                <Form.Item
                    label="Фото документів"
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
                        Створити
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default PassportDataCreatePage;