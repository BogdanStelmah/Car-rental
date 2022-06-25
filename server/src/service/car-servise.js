const cloudinaryService = require("../service/cloudinary-servise");
const carImageService = require("../service/carImage-servise");
const carModel = require("../models/Car");
const CarModel = require("../models/Car");


const createCar = async (carData, carImages) => {
    const uploadedResponse = await cloudinaryService.uploadToCloudinary(carImages);
    const imagesId = await carImageService.saveImagesToDB(uploadedResponse);

    const newCar = new carModel({
        name: carData.name,
        brand: carData.brand,
        modelYear: carData.modelYear,
        description: carData.description,
        color: carData.color,
        numberPeople: carData.numberPeople,
        number: carData.number,
        carImages: imagesId,
        carType: carData.carType
    })
    await newCar.save();

    return newCar;
}

const updateCar = async (id, carData) => {
    const car = await CarModel.findOne({ _id: id })

    const update = await CarModel.getTableFields();

    update.forEach((update) => car[update] = carData[update]);

    await car.save();
}

module.exports = { createCar, updateCar }