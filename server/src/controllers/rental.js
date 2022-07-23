const {queryParser} = require("../utils/queryParser");
const RentalModel = require('../models/Rental');
const CarModel = require('../models/Car');
const PassportDataModel = require('../models/PassportData');
const CustomError = require("../exceptions/custom-error");

exports.getRentals = async (req, res, next) => {
    try {
        const { limit, skip, sort, filters } = await queryParser(req.query, RentalModel);

        const query = [{
            $lookup: {
                from: 'users',
                localField: 'admin',
                foreignField: '_id',
                as: 'admin'
            }
        }, {
            $lookup: {
                from: 'cars',
                localField: 'car',
                foreignField: '_id',
                as: 'car'
            }
        }, {
            $lookup: {
                from: 'passportdatas',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
            { $sort: {'status': 1} },
            {
                $match: filters
            }
        ]

        let count = await RentalModel
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

        const rentals = await RentalModel
            .aggregate(query)

        res.status(200).json({
            message: "Fetched posts successfully.",
            rentals: rentals,
            page: skip,
            totalCount: count,
            totalPages: totalPages
        })
    } catch (error) {
        next(error);
    }
}

exports.getRental= async (req, res, next) => {
    try {
        const rentalId = req.params.id;

        const rental = await RentalModel
            .findById(rentalId)
            .populate('admin')
            .populate('user')
            .populate('car')

        res.status(200).json({
            message: "Fetched posts successfully.",
            rental: rental
        })
    } catch (error) {
        next(error);
    }
}

exports.postRental = async (req, res, next) => {
    try {
        const rentalPeriod = req.body.rentalPeriod;
        const rentalCar = await CarModel.findById(req.body.car);
        if (rentalCar.status) {
            throw CustomError.BadRequestError('Це авто знаходиться в оренді');
        }

        const passportDataUser = await PassportDataModel.findById(req.body.passportData);

        let returnDate = new Date()
        returnDate.setDate(returnDate.getDate() + rentalPeriod)
        const paymentAmount = rentalCar.price * rentalPeriod
        const deposit = Math.ceil(paymentAmount / 3, 2)

        const newRentals = new RentalModel({
            rentalPeriod: rentalPeriod,
            returnDate: returnDate,
            paymentAmount: paymentAmount,
            deposit: deposit,
            user: passportDataUser._id,
            car: rentalCar._id,
            admin: req.user._id
        })

        rentalCar.status = true;
        await rentalCar.save();

        await newRentals.save()

        res.status(201).json({
            message: "Comment created successfully",
            rentals: newRentals
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteRental = async (req, res, next) => {
    try {
        const rental = await RentalModel.findByIdAndDelete(req.params.id);
        const rentedCar = await CarModel.findById(rental.car);

        rentedCar.status = false;
        await rentedCar.save();

        res.status(201).json({
            message: "Rental successfully deleted",
        });
    } catch (error) {
        next(error);
    }
}

exports.endRental = async (req, res, next) => {
    try {
        const rental = await RentalModel.findById(req.params.id);
        const rentedCar = await CarModel.findById(rental.car);

        rentedCar.status = false;
        rental.status = true;

        await rentedCar.save();
        await rental.save();

        res.status(200).json({
            message: "Дані оновлено"
        })
    } catch (e) {
        next(e);
    }
}

exports.getStatistics = async (req, res, next) => {
    try {
        const { filters } = await queryParser(req.query, RentalModel);

        const period = req.query.period || 'day';
        format = {'day': '%Y-%m-%d', 'month': '%Y-%m', 'year': '%Y'};


        const rentalsStatistics = await RentalModel
            .aggregate([
                {
                    $match: {...filters, 'status': true}
                },
                {
                    $project: {
                        "paymentAmount": "$paymentAmount",
                        "createdAt": {
                            $dateToString: {
                                "format": format[period],
                                "date": "$createdAt"
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: "$createdAt",
                        amount: { $sum: "$paymentAmount" },
                        count: { $count: {} },
                    }
                },
                {
                    $sort: {'_id': 1}
                }
            ])

        res.status(200).json({
            message: "Fetched statistic successfully.",
            rentalsStatistics: rentalsStatistics,
        })
    } catch (e) {
        next(e);
    }
}