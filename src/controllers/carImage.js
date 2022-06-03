const CarImageModel = require('../models/CarImage');
const { URL } = require('../utils/conf');
const CarImageServise = require('../service/carImage-servise');

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
        if (!req.file) {
            throw Error("Відсутній файл");
        }
        const imageUrl = req.file.path;
        const carImage = CarImageModel({ imageLink: imageUrl });
        await carImage.save(carImage);
        res.status(201).json({
            message: "Додано нове фото"
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.deleteImage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const imagePath = await CarImageServise.deleteImage(id);

        res.status(200).json({
            message: "Картинку видалено",
            image: imagePath
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
}