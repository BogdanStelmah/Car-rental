require('dotenv').config();
const CustomError = require("../exceptions/custom-error");
const path = require("path");

//Services
const passportDataService = require('../service/passportData-service');
const imageService = require("../service/image-servise");

//Models
const PassportDataModel = require('../models/PassportData');

exports.get = async (req, res, next) => {
    try {
        const passportsData = await passportDataService.getPassportsData();

        res.status(200).json({
            message: "Fetched posts successfully.",
            passportsData: passportsData
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
            if (!(req.files?.length >= 2)) {
                throw CustomError.FilesError('Мінімальна кількість файлів 2');
            }
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

        res.status(500).json({
            message: "Паспортні дані видалено",
        });
    } catch (error) {
        next(error);
    }
}