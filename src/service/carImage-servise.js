const fs = require('fs');
const path = require('path');
const CarImageModel = require('../models/CarImage');

const clearImageFromFolder = async (filePath) => {
    filePath = path.join(path.join(__dirname, '..', '..', path.normalize(filePath)));
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });
}

const deleteImage = async (id) => {
    const image = await CarImageModel.findByIdAndDelete({ _id: id });
    if (!image) {
        throw Error("Такої картинки не знайдено");
    }
    await clearImageFromFolder(image.imageLink);

    return image.imageLink;
}

module.exports = {clearImageFromFolder, deleteImage};