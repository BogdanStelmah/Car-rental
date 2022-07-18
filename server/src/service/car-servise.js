const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
require('dotenv').config();

//Services
const cloudinaryService = require("../service/cloudinary-servise");
const imageService = require("./image-servise");

//Models
const CarModel = require("../models/Car");
const ReviewModel = require("../models/Review")

const createCar = async (carData, carImages) => {
    const uploadedResponse = await cloudinaryService.uploadToCloudinary(carImages, process.env.UPLOAD_PRESET_FOR_CAR_IMAGES);
    const imagesId = await imageService.saveImagesToDB(uploadedResponse);

    const newCar = new CarModel({
        name: carData.name,
        brand: carData.brand,
        modelYear: carData.modelYear,
        description: carData.description,
        price: carData.price,
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

    const update = ['name', 'brand', 'modelYear', 'description', 'color', 'price', 'numberPeople', 'number', 'carType']

    update.forEach((update) => car[update] = carData[update]);

    await car.save();
}

const updateCarRating = async (id) => {
    const avgRating = await ReviewModel.aggregate([
        {
            $match: {
                'car': ObjectId(id)
            }
        },
        {
            $group: {
                _id: null,
                avgReviews: {
                    $avg: "$rating"
                }
            }
        }
    ]);
    const car = await CarModel.findOne({ _id: id })
    car.rating = avgRating[0].avgReviews.toFixed(1)

    await car.save();
}

const addImage = async (idCar, images) => {
    const uploadedResponse = await cloudinaryService.uploadToCloudinary(images, process.env.UPLOAD_PRESET_FOR_CAR_IMAGES);
    const imagesId = await imageService.saveImagesToDB(uploadedResponse);

    const car = await CarModel.findById(idCar);
    car.carImages.push(...imagesId);

    await car.save();
}

const deleteImage = async (idCar, idImage) => {
    let car = await CarModel.findById(idCar);
    await imageService.deleteImage(idImage);


    car.carImages = car.carImages.filter((image) => {return image._id.toString() !== idImage })
    await car.save();
}

module.exports = {
    createCar,
    updateCar,
    updateCarRating,
    addImage,
    deleteImage
};