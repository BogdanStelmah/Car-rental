const express = require('express');
const { body, param } = require('express-validator');

const carController = require('../controllers/car');
const reviewController = require("../controllers/review");

const validationRes = require('../middleware/validationRes');
const authMiddleware = require('../middleware/auth');
const rolesMiddleware = require('../middleware/role');

const CarTypeModel = require("../models/CarType");
const CarModel = require("../models/Car");
const ReviewModel = require("../models/Review");

const router = express.Router();

//Checking the availability of the car
const checkExistCar = () => [
    param('id')
        .isMongoId().withMessage('Невірний формат id')
        .custom(async (value) => {
            const car = await CarModel.findOne({ _id: value });
            if (!car) {
                throw Error("Даного автомобілю не існує");
            }
            return value;
        })
]

//Query body validation for the car
const checkBodyCar = () => [
    body('name')
        .exists()
        .not()
        .isEmpty()
        .withMessage('\"name\" не може бути пустим'),
    body('brand')
        .exists()
        .not()
        .isEmpty()
        .withMessage('\"brand\" не може бути пустим'),
    body('modelYear')
        .isNumeric()
        .isInt({ min: new Date().getFullYear() - 80, max: new Date().getFullYear() })
        .withMessage('Неправильно вказано рік'),
    body('description')
        .isLength({ min: 10 })
        .withMessage("Мінімальний розмір опису 10 символів")
        .isLength({ max: 500 })
        .withMessage("Максимальний розмір опису 500 символів"),
    body('price')
        .isNumeric()
        .isFloat({ min: 1 })
        .withMessage('Неправильно вказано суму оренди'),
    body('color')
        .exists()
        .not()
        .isEmpty()
        .withMessage('\"color\" не може бути пустим'),
    body('numberPeople')
        .isNumeric()
        .isInt({ min: 1, max: 12 })
        .withMessage('Неправильно вказано кількість людей'),
    body('number')
        .isLength({ min: 1 })
        .withMessage("Мінімальний розмір номерного знаку 1 символ")
        .isLength({ max: 10 })
        .withMessage("Максимальний розмір номерного знаку 10 символів"),
    body('carType')
        .isMongoId()
        .withMessage("Неправильний формат id")
        .custom(async value => {
            const carType = await CarTypeModel.findOne({_id: value});
            if (!carType) {
                throw Error("Даного типу не існує");
            }
            return value;
        })
]

// Pagination
// GET /car?limit=&skip=
// Sorting
// GET /car?sort=-name,+brand
// Filtration
// GET /car?name=BMW
router.get('/', carController.getCars);

router.get('/colors', carController.getColors);

router.get('/rentalCarsRating', carController.rentalCarsRating);

router.get('/:id',
    checkExistCar(),
    validationRes,
    carController.getCar);

//POST /car
router.post('/', authMiddleware, rolesMiddleware,
    checkBodyCar(),
    validationRes,
    carController.postCar);

//PUT /car/:id
router.put('/:id', authMiddleware, rolesMiddleware,
    checkExistCar(),
    checkBodyCar(),
    validationRes,
    carController.putCar);

//DELETE /car/:id
router.delete('/:id', authMiddleware, rolesMiddleware,
    checkExistCar(),
    validationRes,
    carController.deleteCar
);

// GET /car/:id/review
router.get('/:id/review',
    [
        param('id')
            .isMongoId().withMessage("Невірний формат id")
            .custom(async (value) => {
                const car = await CarModel.findOne({_id:value});
                if (!car) {
                    throw new Error('Даного автомобіля не існує');
                }
                return value;
            }),
    ],
    validationRes,
    reviewController.getCarReviews
);

// POST /car/:id/review
router.post('/:id/review', authMiddleware, rolesMiddleware,
    [
        body('customer')
            .exists()
            .not()
            .isEmpty()
            .withMessage('\"customer\" не може бути пустим'),
        body('content')
            .exists()
            .not()
            .isEmpty()
            .withMessage('Відгук не може бути пустим')
            .isLength({max: 100}).withMessage("Максимальна кількість букв має бути не більше 100"),
        body('rating')
            .isInt({ min: 1, max: 5 }).withMessage("Рейтинг повинен бути числом від 1 до 5"),
        param('id')
            .isMongoId().withMessage("Невірний формат id")
            .custom(async (value) => {
                const car = await CarModel.findOne({_id:value});
                if (!car) {
                    throw new Error('Даного автомобіля не існує');
                }
                return car;
            }),
    ],
    validationRes,
    reviewController.postReview
);

// DELETE /car/review/:idReview
router.delete('/review/:idReview', authMiddleware, rolesMiddleware,
    [
        param('idReview')
            .isMongoId().withMessage("Невірний формат id")
            .custom(async (value) => {
                const review = await ReviewModel.findOne({_id:value});
                if (!review) {
                    throw new Error('Даного коментраря не існує');
                }
                return value;
            }),
    ],
    validationRes,
    reviewController.deleteReview
);

module.exports = router;
