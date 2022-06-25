const path = require('path');
const CarImageModel = require('../models/CarImage');
const carImageService = require('../service/carImage-servise');
const cloudinaryService = require('../service/cloudinary-servise')

exports.getImages = async (req, res, next) => {
    try {
        const carImages = await CarImageModel.find();
        res.status(200).json({
            message: "Fetched posts successfully.",
            carImages: carImages
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.postImage = async (req, res, next) => {
    try {
        if (!(req.files?.length > 0)){
            throw Error("Відсутній файл");
        }
        if (!(req.files?.length === 1)){
            throw Error("Оберіть тільки один файл");
        }
        for (const element of req.files){
            const ext = path.extname(element.originalname);
            if( ![".png", ".jpg", ".jpeg"].includes(ext) ){
                throw Error("Будь ласка завантажте зображення PNG, JPG, JPEG");
            }
        }

        const uploadedResponse = await cloudinaryService.uploadToCloudinary(req.files);
        await carImageService.saveImagesToDB(uploadedResponse);

        res.status(201).json({
            message: "Додано нове фото",
        })
    } catch (error) {
        res.status(500).json({ 'Error': error.message });
    }
}

exports.deleteImage = async (req, res, next) => {
    try {
        const id = req.params.id;
        await carImageService.deleteImage(id);

        res.status(200).json({
            message: "Картинку видалено"
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
}