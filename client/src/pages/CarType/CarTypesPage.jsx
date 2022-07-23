import React, {useEffect, useState} from 'react';
import {Button, Form, message, Modal, Table} from "antd";
import {queryParser} from "../../components/utils/queryParser";
import CarTypeService from "../../services/CarTypeService";
import {columns} from "../../columns/carTypesColumns";
import {AppstoreAddOutlined} from "@ant-design/icons";
import Input from "antd/es/input/Input";
import Search from "antd/es/input/Search";
import TextArea from "antd/es/input/TextArea";
import CountCarsForCategory from "../../components/DiagramsType/countCarsForCategory";
import {useSelector} from "react-redux";

const CarTypesPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const authUser = useSelector(state => state.auth.user);
    const [form] = Form.useForm();
    const [formCreate] = Form.useForm();
    const [isEdit, setIsEdit] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [editingType, setEditingType] = useState();

    const [dataSource, setDataSource] = useState();
    const [totalPages, setTotalPages] = useState(0);
    const [searchText, setSearchText] = useState();
    const [params, setParams] = useState({
        skip: 1,
        limit: 8
    });

    const getCarTypes = () => {
        setIsLoading(true);
        CarTypeService.fetchCarTypes({...params, ...searchText}).then((response) => {
            setTotalPages(response?.totalCount)
            setDataSource(response?.carTypes);
            setIsLoading(false);
        })
    }

    useEffect(() => {
        getCarTypes();
    }, [params, searchText])

    const handleTableChange = (newPagination, filters, sorter) => {
        const newParams = queryParser(newPagination, filters, sorter)
        setParams({...newParams});
    }

    const handleTextSearch = (value) => {
        if (value !== '') {
            setSearchText({"type": value})
            return;
        }
        setSearchText(undefined);
    }

    const onDeleteType = (record) => {
        Modal.confirm({
            title: "Ви впевнені, що хочете видалити цю категорію?",
            okText: "Так",
            okType: "danger",
            cancelText: "Відміна",
            onOk: () => {
                setIsLoading(true);
                CarTypeService.deleteCarType(record._id)
                    .then(() => {
                        message.success('Успішно видалено')
                        getCarTypes();
                    })
            }
        });
    }

    const onEditCType = (record) => {
        setEditingType({...record});
        form.setFieldsValue({
            "type": record.type,
            "description": record.description
        })
        setIsEdit(true);
    }

    const editType = (value) => {
        setIsLoading(true);

        const data = {}
        for (const valueKey in value) {
            data[valueKey] = value[valueKey];
        }

        CarTypeService.editCarType(editingType._id, data)
            .then(() => {
                message.success('Дані оновлено')
                getCarTypes();
            })
            .catch((error) => {
                let messageText = error?.response?.data?.message;
                if (error?.response?.data?.errors[0]?.msg !== undefined) {
                    messageText = error?.response?.data?.errors[0]?.msg;
                }
                message.error(messageText)
            })
            .finally(() => {
                setIsEdit(false);
            })
    }

    const createType = (value) => {
        setIsLoading(true);
        const data = {}
        for (const valueKey in value) {
            data[valueKey] = value[valueKey];
        }

        CarTypeService.createCarType(data)
            .then(() => {
                message.success('Створено нову категорію')
                getCarTypes();
                setIsCreate(false);
                formCreate.resetFields();
            })
            .catch((error) => {
                let messageText = error?.response?.data?.message;
                if (error?.response?.data?.errors[0]?.msg !== undefined) {
                    messageText = error?.response?.data?.errors[0]?.msg;
                }

                message.error(messageText)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    return (
        <div>
            <Search placeholder="Пошук..." allowClear onSearch={handleTextSearch} style={{ width: 200, marginBottom: '10px' }} size="large"/>
            {authUser.is_superuser &&
                <Button size="large" onClick={() => {
                    setIsCreate(true)
                }}><AppstoreAddOutlined/>Додати категорію</Button>
            }
            <Table
                loading={isLoading}
                columns={columns(onDeleteType, onEditCType, authUser)}
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
                title='Редагування категорії'
                visible={isEdit}
                okText="Зберегти"
                cancelText="Відміна"
                onCancel={() => {
                    setIsEdit(false);
                }}
                onOk={() => {
                    form.submit();
                }}
            >
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    layout="vertical"
                    onFinish={editType}
                >
                    <Form.Item label="Назва категорії" name="type">
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Опис" name="description">
                        <TextArea maxLength={500} rows={5}/>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title='Створення категорії'
                visible={isCreate}
                okText="Створити"
                cancelText="Відміна"
                onCancel={() => {
                    setIsCreate(false);
                }}
                onOk={() => {
                    formCreate.submit();
                }}
            >
                <Form
                    form={formCreate}
                    labelCol={{ span: 6 }}
                    layout="vertical"
                    onFinish={createType}
                >
                    <Form.Item label="Назва категорії" name="type"
                        rules={[
                            { required:true, message:'Будь ласка, введіть назву категорії' },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Опис"
                        name="description"
                        rules={[
                            { required:true, message:'Будь ласка, введіть опис категорії' },
                            { min: 10, message: 'Мінімальний опис 10 символів' }
                        ]}
                    >
                        <TextArea maxLength={500} rows={5}/>
                    </Form.Item>
                </Form>
            </Modal>
            <CountCarsForCategory/>
        </div>
    );
};

export default CarTypesPage;