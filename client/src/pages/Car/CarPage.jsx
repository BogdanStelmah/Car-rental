import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import {queryParser} from "../../components/utils/queryParser";
import {setUser} from "../../toolKitRedux/userSlice";
import {CarService} from "../../services/CarService";

const CarPage = () => {
    const [totalPages, setTotalPages] = useState(0);
    const [params, setParams] = useState({
        skip: 1,
        limit: 5
    });

    useEffect(() => {
        CarService.fetchCars(params).then((response) => {
            setTotalPages(response.totalCount)
            dispatch(setUser(response.cars));
        })
    }, [params])

    const handleTableChange = (newPagination, filters, sorter) => {
        const newParams = queryParser(newPagination, filters, sorter)
        setParams({...newParams});
    }

    const columns = [
        {
            key: 'name',
            title: 'Назва',
            dataIndex: 'name',
            sorter: {multiple: 1}
        },
        {
            key: 'brand',
            title: 'Модель',
            dataIndex: 'brand',
            sorter: {multiple: 2}
        },
        {
            key: 'modelYear',
            title: 'Рік',
            dataIndex: 'modelYear',
            sorter: {multiple: 3}
        },
        {
            key: 'carType',
            title: 'Тип',
            dataIndex: 'carType.type',
            sorter: {multiple: 4}
        },
        {
            key: 'numberPeople',
            title: 'Кількість місць',
            dataIndex: 'numberPeople',
            sorter: {multiple: 5}
        },
        {
            key: 'color',
            title: 'Колір',
            dataIndex: 'color',
            sorter: {multiple: 6}
        },
        {
            key: 'rating',
            title: 'Рейтинг',
            dataIndex: 'rating',
            sorter: {multiple: 7}
        },
        {
            key: 'status',
            title: 'Статус',
            dataIndex: 'status',
            sorter: {multiple: 8}
        }
    ]

    return (
        <div>
            <Table
                // loading={allUser.loading}
                columns={columns}
                // dataSource={allUser.users}
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

export default CarPage;