const CarType = require('../models/CarType');


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
        const idType = req.params.idType;
        const cartype = await CarType.findOne({_id: idType})

        res.status(200).json({
            message: "Fetched posts successfully.",
            carType: cartype
        })
    } catch (error) {
        next(error);
    }
} 

exports.postCarType = async (req, res, next) => {
    try {
        const carType = CarType(req.body);

        await carType.save()
        res.status(201).send(carType);
    } catch (error) {
        next(error);
    }
}

exports.deleteCarType = async (req, res, next) => {
    try {
        const deletedCarType = await CarType.findByIdAndDelete(req.params.idType)

        res.status(204).json({
            message: "Machine type successfully deleted.",
        });
    } catch (error) {
        next(error);
    }
} 

exports.putCarType = async (req, res, next) => {
    try {
        const carType = await CarType.findById(req.params.idType);
        const update = ['type', 'description'];
        update.forEach((update) => carType[update] = req.body[update]);
        await carType.save();

        res.status(204).json({
            message: "Данні про тип оновленно"
        });
    } catch (error) {
        next(error);
    }
} 