const {queryParser} = require("../utils/queryParser");
const CustomError = require("../exceptions/custom-error");
const path = require("path");

//Models
const CarModel = require('../models/Car');
const RentalModel = require('../models/Rental');

//Services
const carService = require("../service/car-servise");
const imageService = require('../service/image-servise');

exports.getCars = async (req, res, next) => {
    try {
        const { limit, skip, sort, filters } = await queryParser(req.query, CarModel);

        const query = [{
                $lookup: {
                    from: 'cartypes',
                    localField: 'carType',
                    foreignField: '_id',
                    as: 'carType'
                }
            }, {
                $lookup: {
                    from: 'images',
                    localField: 'carImages',
                    foreignField: '_id',
                    as: 'carImages'
                }
            },
            {
                $match: filters
            }
        ]

        let count = await CarModel
            .aggregate(query.concat([
                {
                    $count: 'countDocuments'
                }
            ]))
        count = count[0]?.countDocuments;
        const totalPages = Math.ceil(count / limit);

        if (sort) {
            query.push({ $sort: sort });
        }
        query.push({ $skip: skip });
        query.push({ $limit: limit });

        const cars = await CarModel
            .aggregate(query)

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

exports.getCar = async (req, res, next) => {
    try {
        const carId = req.params.id;

        const car = await CarModel
            .findById(carId)
            .populate('carImages')
            .populate('carType')

        res.status(200).json({
            message: "Fetched posts successfully.",
            car: car,
        })
    } catch (e) {
        next(e);
    }
}

exports.getColors = async (req, res, next) => {
    try {
        const colors = await CarModel.distinct('color')

        res.status(200).json({
            message: "Fetched posts successfully.",
            colors: colors
        })
    } catch (e) {
        next(e);
    }
}

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

        res.status(200).json({
            message: "Автомобіль видалено",
        });
    } catch (error) {
        next(error);
    }
};

exports.rentalCarsRating = async (req, res, next) => {
    try {
        const carRating = await RentalModel.aggregate([
            {
                $group: {
                    _id: "$car",
                    count: {$count: {}}
                }
            },
            { $sort: {count: -1} },
            {
                $lookup: {
                    from: 'cars',
                    localField: '_id',
                    foreignField: '_id',
                    as: '_id'
                }
            },
        ])

        carRating.map((data) => {
            return data._id = data._id[0].name;
        })

        res.status(200).json({
            message: "Рейтинг успішно отримано",
            carRating: carRating
        });
    } catch (e) {
        next(e);
    }
}

