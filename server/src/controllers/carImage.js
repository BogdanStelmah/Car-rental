const path = require('path');
const CustomError = require("../exceptions/custom-error");
require('dotenv').config();

//Models
const ImageModel = require('../models/Image');

//Services
const carService = require("../service/car-servise");


exports.getImages = async (req, res, next) => {
    try {
        const images = await ImageModel.find();
        res.status(200).json({
            message: "Fetched posts successfully.",
            images: images
        });
    } catch (error) {
        next(error);
    }
}

exports.postImage = async (req, res, next) => {
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

        await carService.addImage(req.params.idCar, req.files);

        res.status(201).json({
            message: "Додано нові фото",
        })
    } catch (error) {
        next(error);
    }
}

exports.deleteImage = async (req, res, next) => {
    try {
        const idCar = req.params.idCar;
        const idImage = req.params.idImage;

        carService.deleteImage(idCar, idImage)

        res.status(200).json({
            message: "Картинку видалено"
        })
    } catch (error) {
        next(error);
    }
}