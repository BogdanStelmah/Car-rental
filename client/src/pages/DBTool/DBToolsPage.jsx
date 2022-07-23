import React, {useEffect, useState} from 'react';
import DBService from "../../services/DBService";
import {Button, message, Modal, Row, Spin} from "antd";
import classes from './DBToolsPage.module.css'

const DbToolsPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isClickButton, setIsClickButton] = useState(false);
    const [collectionSizes, setCollectionSizes] = useState();

    const getCollectionSizes = () => {
        setIsLoading(true);
        DBService.getCollectionSizes()
            .then((response) => {
                setCollectionSizes(response.statistics);
                setIsLoading(false);
            })
            .catch((error) => {
            })
    }

    useEffect(() => {
        getCollectionSizes();
    }, [])

    const backup = () => {
        Modal.confirm({
            title: "Ви впевнені, що хочете зробити резервне копіювання бази даних?",
            okText: "Так",
            okType: "danger",
            cancelText: "Відміна",
            onOk: () => {
                setIsClickButton(true)
                setIsLoading(true);
                DBService.dumpDatabase()
                    .then(() => {
                        message.success('Резервне копіювання бази даних успішно виконано')
                        setIsClickButton(false)
                        getCollectionSizes();
                    })
            }
        });
    }

    const restore = () => {
        Modal.confirm({
            title: "Ви впевнені, що хочете зробити відновлення бази даних?",
            okText: "Так",
            okType: "danger",
            cancelText: "Відміна",
            onOk: () => {
                setIsClickButton(true)
                setIsLoading(true);
                DBService.restoreDatabase()
                    .then(() => {
                        message.success('Відновлення бази даних успішно виконано')
                        setIsClickButton(false)
                        getCollectionSizes();
                    })
            }
        });
    }

    return (
        <div>
            <div>
                <h1>Резервне копіювання та відновлення бази даних</h1>
                <Button style={{marginRight: 20}} onClick={backup} loading={isClickButton}>Зберегти</Button>
                <Button onClick={restore} loading={isClickButton}>Відновити</Button>
            </div>
            <div>
                <h1>Інформація про колекції</h1>
                <Row>
                    {isLoading
                        ? <div>
                            <Spin size="large"/>
                        </div>
                        :
                        <>{collectionSizes?.map((collection) =>
                            <div className={classes.list__item}>
                                <div className={classes.item__title}>{collection.nameCollection}</div>
                                <div className={classes.block__info}>
                                    <div className={classes.item__info}>Кількість
                                        записів: <b>{collection.countDocuments}</b></div>
                                </div>
                            </div>)}
                        </>
                    }
                </Row>
            </div>
        </div>
    );
};

export default DbToolsPage;