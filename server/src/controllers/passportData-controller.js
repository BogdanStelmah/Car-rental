require('dotenv').config();
const CustomError = require("../exceptions/custom-error");
const path = require("path");
const {queryParser} = require("../utils/queryParser");

//Services
const passportDataService = require('../service/passportData-service');
const imageService = require("../service/image-servise");

//Models
const PassportDataModel = require('../models/PassportData');


exports.get = async (req, res, next) => {
    try {
        const { limit, skip, sort, filters } = await queryParser(req.query, PassportDataModel);

        const query = [
            {
                $lookup: {
                    from: 'images',
                    localField: 'imageLink',
                    foreignField: '_id',
                    as: 'imageLink'
                },
            },
            {
                $match: filters
            }
        ]

        let count = await PassportDataModel
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

        const passportsData = await PassportDataModel
            .aggregate(query)

        res.status(200).json({
            message: "Fetched posts successfully.",
            passportsData: passportsData,
            page: skip,
            totalCount: count,
            totalPages: totalPages
        })
    } catch (error) {
        next(error);
    }
}

exports.getId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const passportsData = await passportDataService.getPassportData(id);

        res.status(200).json({
            message: "Fetched posts successfully.",
            passportsData: passportsData
        })
    } catch (error) {
        next(error);
    }
}

exports.post = async (req, res, next) => {
    try {
        if (!(req.files?.length >= 2)){
            throw CustomError.FilesError('Мінімальна кількість файлів 2');
        }
        for (const element of req.files){
            const ext = path.extname(element.originalname);
            if( ![".png", ".jpg", ".jpeg"].includes(ext) ){
                throw CustomError.FilesError('Будь ласка завантажте зображення PNG, JPG, JPEG');
            }
        }

        await passportDataService.createPassportData(req.body, req.files);

        res.status(201).json({
            message: "Створено нові дані",
        });
    } catch (error) {
        next(error)
    }
}

exports.postIdUser = async (req, res, next) => {
    try {
        if (req.files?.length !== 0) {
            for (const element of req.files) {
                const ext = path.extname(element.originalname);
                if (![".png", ".jpg", ".jpeg"].includes(ext)) {
                    throw CustomError.FilesError('Будь ласка завантажте зображення PNG, JPG, JPEG');
                }
            }
        }

        await passportDataService.addPassportDataToUser(req.params.idUser ,req.body, req.files);

        res.status(201).json({
            message: "Створено нові дані",
        });
    } catch (error) {
        next(error)
    }
}

exports.delete = async (req, res, next) => {
    try {
        const data = await PassportDataModel.findOneAndDelete({ _id: req.params.id });
        if (!data) {
            throw CustomError.BadRequestError('Даного документу не знайдено')
        }
        for (const imageId of data.imageLink) {
            imageService.deleteImage(imageId);
        }

        res.status(200).json({
            message: "Паспортні дані видалено",
        });
    } catch (error) {
        next(error);
    }
}

exports.put = async (req, res, next) => {
    try {
        passportDataService.updatePassportData(req.params.id, req.body);

        res.status(200).json({
            message: "Паспортні дані оновленно"
        })
    } catch (e) {
        next(e);
    }
}

exports.addPhotos = async (req, res, next) => {
    try {
        if (!(req.files?.length > 0)){
            return res.status(201);
        }
        for (const element of req.files){
            const ext = path.extname(element.originalname);
            if( ![".png", ".jpg", ".jpeg"].includes(ext) ){
                throw CustomError.FilesError('Будь ласка завантажте зображення PNG, JPG, JPEG');
            }
        }

        await passportDataService.addImage(req.params.id, req.files);

        res.status(201).json({
            message: "Додано нові фото",
        })
    } catch (e) {
        next(e);
    }
}

exports.deleteImage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const idImage = req.params.idImage;

        passportDataService.deleteImage(id, idImage)

        res.status(200).json({
            message: "Картинку видалено"
        })
    } catch (error) {
        next(error);
    }
}