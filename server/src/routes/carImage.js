const express = require('express');
const {param} = require("express-validator");

//Middleware
const validationRes = require('../middleware/validationRes');
const authMiddleware = require('../middleware/auth');
const rolesMiddleware = require('../middleware/role');
//Controllers
const carImageController = require('../controllers/carImage');
//Models
const CarModel = require("../models/Car");
const ImageModel = require("../models/Image");
const CustomError = require("../exceptions/custom-error");

const router = express.Router();

router.get('/', carImageController.getImages);

//POST /carImage/:idCar
router.post('/:idCar',
    // authMiddleware,
    // rolesMiddleware,
    [
        param('idCar')
            .isMongoId().withMessage('Невірний формат id')
            .custom(async (value) => {
                const car = await CarModel.findOne({ _id: value });
                if (!car) {
                    throw CustomError.BadRequestError("Даного автомобілю не існує");
                }
                return value;
            }),
    ],
    validationRes,
    carImageController.postImage);


//DELETE /carImage/:idCar/:idImage
router.delete('/:idCar/:idImage',
    // authMiddleware,
    // rolesMiddleware,
    [
        param('idCar')
            .isMongoId().withMessage('Невірний формат id')
            .custom(async (value) => {
                const car = await CarModel.findOne({ _id: value });
                if (!car) {
                    throw CustomError.BadRequestError("Даного автомобілю не існує");
                }
                return value;
            }),
        param('idImage')
            .isMongoId().withMessage('Невірний формат id')
            .custom(async (value) => {
                const image = await ImageModel.findById(value);
                if (!image) {
                    throw CustomError.BadRequestError("Такої картнки не існує")
                }
            })
    ],
    validationRes,
    carImageController.deleteImage);

module.exports = router;