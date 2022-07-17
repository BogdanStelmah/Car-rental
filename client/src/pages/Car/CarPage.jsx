import React, {useEffect, useState} from 'react';
import {Button, Modal, Table} from "antd";
import {queryParser} from "../../components/utils/queryParser";
import {CarService} from "../../services/CarService";
import {columns} from "../../columns/carColumns";
import {ADMIN_ROUTE, CAR_CREATED} from "../../components/utils/consts";
import {useNavigate} from "react-router-dom";

const CarPage = () => {
    let navigate = useNavigate();

    const [dataSource, setDataSource] = useState();
    const [totalPages, setTotalPages] = useState(0);
    const [params, setParams] = useState({
        skip: 1,
        limit: 5
    });

    const getCar = () => {
        CarService.fetchCars(params).then((response) => {
            setTotalPages(response.totalCount)
            setDataSource(response.cars);
        })
    }

    useEffect(() => {
        getCar();
    }, [params])

    const handleTableChange = (newPagination, filters, sorter) => {
        const newParams = queryParser(newPagination, filters, sorter)
        setParams({...newParams});
    }

    const onDeleteCar = (record) => {
        Modal.confirm({
            title: "Ви впевнені, що хочете видалити цей автомобіль?",
            okText: "Так",
            okType: "danger",
            cancelText: "Відміна",
            onOk: () => {
                CarService.deleteCar(record._id).then(() => {
                    getCar();
                });
            }
        });
    };

    const onEditCar = (record) => {
        // setIsEdit(true);
        // setEditingUser({...record});
        // setPassportData(new PassportDataTDO({...record?.passportData[0]}))
    };

    return (
        <div>
            <Button onClick={() => navigate(ADMIN_ROUTE + "/" + CAR_CREATED)}>Додати автомобіль</Button>
            <Table
                columns={columns(onDeleteCar, navigate)}
                dataSource={dataSource}
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