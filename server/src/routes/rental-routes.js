const express = require("express");
const {param, body} = require("express-validator");
const CustomError = require("../exceptions/custom-error");
const validationRes = require("../middleware/validationRes");
const RentalModel = require('../models/Rental');
const CarModel = require("../models/Car");
const PassportDataModel = require('../models/PassportData');
const rentalController = require('../controllers/rental');
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

const router = express.Router();

//GET /rental/
router.get('/', rentalController.getRentals)

//GEt /rental/statistics
router.get('/statistics', rentalController.getStatistics);

//GET /rental/:id
router.get('/:id',
    [
        param('id')
            .isMongoId().withMessage('Невірний формат id')
            .custom(async (value) => {
                const rental = await RentalModel.findOne({ _id: value });
                if (!rental) {
                    throw CustomError.BadRequestError("Даного замовлення не існує");
                }
                return value;
            }),
    ],
    validationRes,
    rentalController.getRental)

//POST /rental
router.post('/', authMiddleware, roleMiddleware,
    [
        body('car')
            .custom(async (value) => {
                const car = await CarModel.findOne({ _id: value });
                if (!car) {
                    throw Error("Даного автомобілю не існує");
                }
                return value;
            }),
        body('passportData')
            .custom(async (value) => {
                const passportData = await PassportDataModel.findOne({ _id: value });
                if (!passportData) {
                    throw Error("Даного користувача не знайдено");
                }
                return value;
            }),
        body('rentalPeriod')
            .isNumeric()
            .isInt({ min: 1 })
            .withMessage('Неправильно вказано період оренди'),
    ],
    validationRes,
    rentalController.postRental)

//PUT /rental/:id
router.put('/:id', authMiddleware, roleMiddleware,
    [
        param('id')
            .isMongoId().withMessage('Невірний формат id')
            .custom(async (value) => {
                const rental = await RentalModel.findOne({ _id: value });
                if (!rental) {
                    throw CustomError.BadRequestError("Даного замовлення не існує");
                }
                return value;
            }),
    ],
    validationRes,
    rentalController.endRental)

//DELETE /rental/:id
router.delete('/:id', authMiddleware, roleMiddleware,
    [
        param('id')
            .isMongoId().withMessage('Невірний формат id')
            .custom(async (value) => {
                const rental = await RentalModel.findOne({ _id: value });
                if (!rental) {
                    throw CustomError.BadRequestError("Даного замовлення не існує");
                }
                return value;
            }),
    ],
    validationRes,
    rentalController.deleteRental)

module.exports = router;