const express = require("express");

const auth = require("../middleware/auth");
const rolesMiddleware = require("../middleware/role");

const passportDataController = require('../controllers/passportData-controller');

const {param, body} = require("express-validator");
const validationRes = require("../middleware/validationRes");

const UserModel = require("../models/User");
const PassportDataModel = require('../models/PassportData');
const CustomError = require("../exceptions/custom-error");
const ImageModel = require("../models/Image");

const router = express.Router();

router.get('/', auth, rolesMiddleware, passportDataController.get);

router.get('/:id', auth, rolesMiddleware,
    [
        param('id')
            .isMongoId().withMessage("Неправильний формат id")
    ],validationRes,
    passportDataController.getId);

router.post('/', auth, rolesMiddleware,
    [
        body('firstname')
            .exists()
            .not()
            .isEmpty()
            .withMessage('firstname не може бути пустим'),
        body('secondName')
            .exists()
            .not()
            .isEmpty()
            .withMessage('secondName не може бути пустим'),
        body('lastname')
            .exists()
            .not()
            .isEmpty()
            .withMessage('lastname не може бути пустим'),
        body('phoneNumber')
            .matches(/^\+?3?8?(0[5-9][0-9]\d{7})$/)
            .withMessage('Номер телефону повинен бути формату +380XXXXXXXXX'),
        body('birthdate')
            .exists()
            .not()
            .isEmpty()
            .withMessage('\"Дата народження\" не може бути пустим')
            .isDate().withMessage('Неправильний формат дати народження')
    ],validationRes,
    passportDataController.post);

router.post('/:idUser', auth, rolesMiddleware,
    [
        param('idUser')
            .isMongoId().withMessage("Неправильний формат id")
            .custom(async (value) => {
                console.log('few')
                const user = await UserModel.findOne({_id:value});
                if (!user) {
                    throw new Error('Даного користувача не існує');
                }
                return value;
            }),
        body('phoneNumber')
            .exists()
            .optional()
            .matches(/^\+?3?8?(0[5-9][0-9]\d{7})$/)
            .withMessage('Номер телефону повинен бути формату +380XXXXXXXXX'),
        body('birthdate')
            .exists()
            .optional()
            .isDate().withMessage('Неправильний формат дати народження')
    ],validationRes,
    passportDataController.postIdUser)

router.delete('/:id', auth, rolesMiddleware,
    [
        param('id')
            .isMongoId().withMessage("Неправильний формат id")
    ],validationRes,
    passportDataController.delete);

router.post('/photos/:id', auth, rolesMiddleware,
    [
        param('id')
            .isMongoId().withMessage("Неправильний формат id")
            .custom(async (value) => {
                const user = await PassportDataModel.findById(value);
                if (!user) {
                    throw new Error('Даних записів не існує');
                }
                return value;
            }),
    ],
    validationRes,
    passportDataController.addPhotos)

router.delete('/:id/photos/:idImage', auth, rolesMiddleware,
    [
        param('id')
            .isMongoId().withMessage('Невірний формат id')
            .custom(async (value) => {
                const car = await PassportDataModel.findById(value);
                if (!car) {
                    throw CustomError.BadRequestError("Даного запису не існує");
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
    ], validationRes,
    passportDataController.deleteImage)

router.put('/:id', auth, rolesMiddleware,
    [
        param('id')
            .isMongoId().withMessage('Невірний формат id')
            .custom(async (value) => {
                const car = await PassportDataModel.findById(value);
                if (!car) {
                    throw CustomError.BadRequestError("Даного запису не існує");
                }
                return value;
            }),
        body('phoneNumber')
            .matches(/^\+?3?8?(0[5-9][0-9]\d{7})$/)
            .withMessage('Номер телефону повинен бути формату +380XXXXXXXXX'),
    ],validationRes,
    passportDataController.put)

module.exports = router;