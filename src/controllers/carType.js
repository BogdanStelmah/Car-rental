const CarType = require('../models/CarType');
const { validationResult } = require('express-validator')


exports.getCarTypes = async (req, res, next) => {
    try {
        const carTypes = await CarType.find();
        res.status(200).json({
            message: "Fetched posts successfully.",
            carTypes: carTypes
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
} 

exports.getCarType = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).send(errors);
        }

        if(!req.params.idType) return res.status(400).send();
        
        const idType = req.params.idType;
        const cartype = await CarType.findById({_id: idType})
        if (!cartype) {
            throw Error("Даний тип не існує")
        }

        res.status(200).json({
            message: "Fetched posts successfully.",
            carType: cartype
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
} 

exports.postCarType = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).send(errors);
        }

        if(!req.body) return res.status(400);

        const carType = CarType(req.body);

        await carType.save()
        res.status(201).send(carType);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.deleteCarType = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).send(errors);
        }
        if(!req.params.idType) return res.status(400);
        const carType = await CarType.findById(req.params.idType)
        if (!carType) {
            throw Error("Даного типу не існує");
        }

        const deletedCarType = await CarType.findByIdAndDelete(req.params.idType)

        res.status(200).send(deletedCarType);
    } catch (error) {
        res.status(500).send(error.message);
    }
} 

exports.putCarType = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).send(errors);
        }
        if(!req.params.idType) return res.status(400);

        const carType = await CarType.findById(req.params.idType);

        if (!carType){
            throw Error("Даного типу не існує");
        }

        const update = ['type', 'description'];
        update.forEach((update) => carType[update] = req.body[update]);

        await carType.save();

        res.status(200).send(carType);
    } catch (error) {
        res.status(500).send(error.message);
    }
} 