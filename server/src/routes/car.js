const express = require('express');
const { body, param } = require('express-validator');

const carController = require('../controllers/car')
const validationRes = require('../middleware/validationRes');
const auth = require('../middleware/auth');

const CarTypeModel = require("../models/CarType");
const CarModel = require("../models/Car");

const router = express.Router();

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
    body('color')
        .exists()
        .not()
        .isEmpty()
        .withMessage('\"color\" не може бути пустим'),
    body('numberPeople')
        .isNumeric()
        .isInt({ min: 1, max: 12 })
        .withMessage('Неправильно вказано клькість людей'),
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

router.post('/', auth, checkBodyCar(), validationRes, carController.postCar);

router.put('/:id',
    checkExistCar(),
    checkBodyCar(),
    validationRes,
    carController.putCar);

router.delete('/:id', auth,
    checkExistCar(),
    validationRes,
    carController.deleteCar
);

module.exports = router;
