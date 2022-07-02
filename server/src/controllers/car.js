const CarModel = require('../models/Car');

const path = require("path");

const carService = require("../service/car-servise");
const imageService = require('../service/image-servise');
const {queryParser} = require("../utils/queryParser");
const CustomError = require("../exceptions/custom-error");

exports.getCars = async (req, res, next) => {
    try {
        const { limit, skip, sort, filters } = await queryParser(req.query, CarModel);

        const count = await CarModel.countDocuments();
        const totalPages = Math.ceil(count / limit);

        const cars = await CarModel
            .find(filters)
            .sort(sort)
            .limit(limit)
            .skip((skip -1 ) * limit)
            .populate('carType')
            .populate('carImages');

        res.status(200).json({
            message: "Fetched posts successfully.",
            cars: cars,
            page: skip,
            totalCount: count,
            totalPages: totalPages
        })
    } catch (error) {
        next(error);
    }
};

exports.postCar = async (req, res, next) => {
    try {
        if (!(req.files?.length > 0)){
            throw CustomError.FilesError('Відсутні файли');
        }
        for (const element of req.files){
            const ext = path.extname(element.originalname);
            if( ![".png", ".jpg", ".jpeg"].includes(ext) ){
                throw CustomError.FilesError('Будь ласка завантажте зображення PNG, JPG, JPEG');
            }
        }

        const newCar = await carService.createCar(req.body, req.files);

        res.status(201).json({
            message: "Створено новий автомобіль",
            car: newCar
        });
    } catch (error) {
        next(error);
    }
};

exports.putCar = async (req, res, next) => {
    try {
        carService.updateCar(req.params.id, req.body);

        res.status(200).json({
            message: "Данні про автомобіль оновленно"
        })
    } catch (error) {
        next(error);
    }
};

exports.deleteCar = async (req, res, next) => {
    try {
        const car = await CarModel.findOneAndDelete({ _id: req.params.id });

        for (const imageId of car.carImages) {
            imageService.deleteImage(imageId);
        }

        res.status(500).json({
            message: "Автомобіль видалено",
        });
    } catch (error) {
        next(error);
    }
};

