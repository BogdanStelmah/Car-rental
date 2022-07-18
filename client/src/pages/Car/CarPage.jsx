import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {CarService} from "../../services/CarService";
import {Button, Carousel, message, Rate} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import classes from './CarCreatePage.module.css';
import {ReviewsService} from "../../services/ReviewsService";

const CarPage = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [car, setCar] = useState(null);
    const [carReviews, setCarReviews] = useState(null);

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
                    : <div>
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
                        <Button>Оформити оренду</Button>
                    </div>
                </div>

                <div className={classes.reviews__car}>
                    <h1>Відгуки</h1>
                    {carReviews?.map((review) =>
                        <div>
                            <div><Rate disabled allowHalf value={review.rating}/></div>
                            <div>{review.content}</div>
                            <div>{review.createdAt.split('T')[0]}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarPage;