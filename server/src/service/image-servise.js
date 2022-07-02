const fs = require('fs');
const path = require('path');
const ImageModel = require('../models/Image');
const cloudinaryService = require('../service/cloudinary-servise');
const CustomError = require("../exceptions/custom-error");

const saveImagesToDB = async (images) => {
    try {
        let imagesId = [];

        for(const image of images) {
            const newImage = ImageModel({
                imageLink: image.url,
                cloudinaryId: image.public_id
            });
            await newImage.save(newImage);
            imagesId.push(newImage._id);
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
    const image = await ImageModel.findByIdAndDelete({ _id: id });
    if (!image) {
        throw CustomError.FilesError("Такої картинки не знайдено");
    }

    cloudinaryService.deleteFromCloudinary(image);
}

module.exports = {clearImageFromFolder, deleteImage, saveImagesToDB};