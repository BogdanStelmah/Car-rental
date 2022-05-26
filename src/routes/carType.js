const express = require('express');
const carTypeController = require('../controllers/carType');
const { body, param } = require('express-validator');
const CarType = require('../models/CarType');
const auth = require('../middleware/auth');
const validationRes = require('../middleware/validationRes');

const router = express.Router();

// GET /carType
router.get('/', carTypeController.getCarTypes);


// GET /carType/:idType
router.get('/:idType',
[
    param('idType')
        .isMongoId().withMessage("Невірний формат id")
        .custom(async (value) => {
            const carType = await CarType.findOne({_id:value});
            if (!carType) {
                throw new Error('Даного типу не існує');
            }
        }),
], 
validationRes,
carTypeController.getCarType);


// POST /carType
router.post('/', auth,
[
    body('type')
        .isLength({max: 20}).withMessage("Максимальна кількість букв має бути не більше 20")
        .custom(async value => {
            const carType = await CarType.findOne({ type: value });
            if (carType) {
                throw Error("Даний тип вже існує");
            } else {
                return value;
            }
        }),
    body('description')
        .isLength({max: 400}).withMessage("Максимальна кількість букв має бути не більше 400")
],
validationRes,
carTypeController.postCarType);


// DELETE /carType/:idType
router.delete('/:idType', auth, 
[
    param('idType')
        .isMongoId().withMessage("Невірний формат id")
        .custom(async (value) => {
            const carType = await CarType.findOne({_id:value});
            if (!carType) {
                throw new Error('Даного типу не існує');
            }
        }),
],
validationRes,
carTypeController.deleteCarType);


// PUT /carType/:idType
router.put('/:idType', auth,
[
    param('idType')
        .isMongoId().withMessage("Невірний формат id")
        .custom(async (value, {req}) => {
            const carType = await CarType.findOne({_id:value});
            if (!carType) {
                throw Error('Даного типу не існує');
            } else {
                const duplicateCarType = await CarType.findOne({type: req.body.type});
                if (duplicateCarType){
                    throw Error('Такий тип вже існує');
                }
            }
        }),
],
validationRes,
carTypeController.putCarType);

module.exports = router;
