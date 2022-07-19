//Models
const ReviewModel = require("../models/Review");
//Services
const carService = require("./car-servise");

exports.getReviewsByUserId = async (userId) => {
    return await ReviewModel.find({ user: userId });
}

exports.getReviewsByCarId = async (carId) => {
    return await ReviewModel.find({ car: carId }).populate('user');
}

exports.createReview = async (reviewData, carId) => {
    const newReview = await ReviewModel({
        content: reviewData.content,
        rating: reviewData.rating,
        user: reviewData.customer,
        car: carId,
    });
    await newReview.save()
    await carService.updateCarRating(carId);

    return newReview;
}