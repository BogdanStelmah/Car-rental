const express = require('express');

const CarType = require('../models/CarType');

const router = express.Router();

router.get('/', (req, res, next) => {
    CarType.find()
        .then(carTypes => {
            res.status(200).send(carTypes);
        }).catch(error => {
            res.status(500).send(error);
        });
});

router.get('/:carTypeId', (req, res, next) => {
    const idCarType = req.params.carTypeId;

    CarType.findById(idCarType)
        .then(carType => {
            res.status(200).send(carType);
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.post('/', (req, res, next) => {
    if(!req.body) return res.status(400);

    const carType = CarType(req.body);

    carType.save()
        .then(result => {
            console.log(carType)
            res.status(200).send(carType);
        })
        .catch(error => {
            console.log(error)
            res.status(500).send(error);
        });
});

router.delete('/:carTypeId', (req, res, next) => {
    CarType.findByIdAndDelete(req.params.carTypeId)
        .then(result => {
            res.status(200).send();
        })
        .catch(error => {
            res.status(500).send()
        })
});

module.exports = router;
