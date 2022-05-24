const express = require('express');
const carTypeController = require('../controllers/carType');
const { body } = require('express-validator');
const CarType = require('../models/CarType');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /carType
router.get('/', carTypeController.getCarTypes);


// GET /carType/:carTypeName
router.get('/:idType',
[
    body('type')
        .custom(async (value) => {
            const carType = await CarType.findOne({type:value});
            if (!carType) {
                throw new Error('Даного типу не існує');
            }
        }),
],
carTypeController.getCarType);


// POST /carType/:carTypeName
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
        })
],
carTypeController.postCarType);


// DELETE /carType/:carTypeName
router.delete('/:idType', auth, carTypeController.deleteCarType);


// PUT /carType/:carTypeName
router.put('/:idType', auth, carTypeController.putCarType);

module.exports = router;
