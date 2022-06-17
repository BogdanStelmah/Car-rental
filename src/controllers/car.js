const carModel = require('../models/Car');
const path = require("path");
const {createCar} = require("../service/carType-servise");

exports.getCars = async (req, res, next) => {
    try {
        const cars = await carModel
            .find()
            .populate('carType')
            .populate('carImages');

        res.status(200).json({
            message: "Fetched posts successfully.",
            cars: cars
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.postCar = async (req, res, next) => {
    try {
        if (!(req.files?.length > 0)){
            throw Error("Відсутні файли");
        }
        for (const element of req.files){
            const ext = path.extname(element.originalname);
            if( ![".png", ".jpg", ".jpeg"].includes(ext) ){
                throw Error("Будь ласка завантажте зображення PNG, JPG, JPEG");
            }
        }

        const newCar = await createCar(req.body, req.files);

        res.status(201).json({
            message: "Створено нову машину",
            car: newCar
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.putCar = async (req, res, next) => {
    try {
        res.status(500).send(error.message);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteCar = async (req, res, next) => {
    try {
        res.status(500).send(error.message);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

