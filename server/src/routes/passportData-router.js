const express = require("express");

const auth = require("../middleware/auth");
const rolesMiddleware = require("../middleware/role");

const passportDataController = require('../controllers/passportData-controller');

const {param, body} = require("express-validator");
const validationRes = require("../middleware/validationRes");

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
            .withMessage('color не може бути пустим')
            .isDate().withMessage('Неправильний формат дати народження')
    ],validationRes,
    passportDataController.post);

router.delete('/:id', auth, rolesMiddleware,
    [
        param('id')
            .isMongoId().withMessage("Неправильний формат id")
    ],validationRes,
    passportDataController.delete);

module.exports = router;