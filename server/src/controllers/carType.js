const {queryParser} = require("../utils/queryParser");

//Models
const CarTypeModel = require('../models/CarType');
const CarModel = require("../models/Car");

exports.getCarTypes = async (req, res, next) => {
    try {
        const { limit, skip, sort, filters } = await queryParser(req.query, CarTypeModel);

        const query = [{
            $match: filters
        }]

        let count = await CarTypeModel
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

        const carTypes = await CarTypeModel
            .aggregate(query)

        res.status(200).json({
            message: "Fetched posts successfully.",
            carTypes: carTypes,
            page: skip,
            totalCount: count,
            totalPages: totalPages
        })
    } catch (error) {
        next(error)
    }
} 

exports.getCarType = async (req, res, next) => {
    try {
        const idType = req.params.idType;
        const cartype = await CarTypeModel.findOne({_id: idType})

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
        const carType = CarTypeModel(req.body);

        await carType.save()
        res.status(201).json({
            message: "Створено нову категорію",
            carType: carType
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteCarType = async (req, res, next) => {
    try {
        const deletedCarType = await CarTypeModel.findByIdAndDelete(req.params.idType)

        res.status(204).json({
            message: "Machine type successfully deleted.",
        });
    } catch (error) {
        next(error);
    }
} 

exports.putCarType = async (req, res, next) => {
    try {
        const carType = await CarTypeModel.findById(req.params.idType);
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

exports.countCarsForCategory = async (req, res, next) => {
    try {
        const countCarsForCategory = await CarModel.aggregate([
            {
                $group: {
                    _id: "$carType",
                    count: {$count: {}}
                }
            },
            { $sort: {count: -1} },
            {
                $lookup: {
                    from: 'cartypes',
                    localField: '_id',
                    foreignField: '_id',
                    as: '_id'
                }
            },
        ])

        countCarsForCategory.map((data) => {
            return data._id = data._id[0].type;
        })

        res.status(200).json({
            message: "Кількість автомобілів для кожної категорі, успішно отримано",
            countCarsForCategory: countCarsForCategory
        });
    } catch (e) {
        next(e);
    }
}