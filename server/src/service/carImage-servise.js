const fs = require('fs');
const path = require('path');
const CarImageModel = require('../models/CarImage');
const cloudinaryService = require('../service/cloudinary-servise');
const CustomError = require("../exceptions/custom-error");

const saveImagesToDB = async (images) => {
    try {
        let imagesId = [];

        for(const image of images) {
            const carImage = CarImageModel({
                imageLink: image.url,
                cloudinaryId: image.public_id
            });
            await carImage.save(carImage);
            imagesId.push(carImage._id);
        }

        return imagesId;
    } catch (e) {
        throw CustomError.FilesError('Помилка збереження файлів');
    }
}

const clearImageFromFolder = async (filePath) => {
    filePath = path.join(path.join(__dirname, '..', '..', path.normalize(filePath)));
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });
}

const deleteImage = async (id) => {
    const image = await CarImageModel.findByIdAndDelete({ _id: id });
    if (!image) {
        throw CustomError.FilesError("Такої картинки не знайдено");
    }

    cloudinaryService.deleteFromCloudinary(image);
}

module.exports = {clearImageFromFolder, deleteImage, saveImagesToDB};