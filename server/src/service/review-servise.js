//Models
const ReviewModel = require("../models/Review");
//Services
const carService = require("./car-servise");

exports.getReviewsByUserId = async (userId) => {
    return await ReviewModel.find({ user: userId });
}

exports.getReviewsByCarId = async (carId) => {
    return await ReviewModel.find({ car: carId });
}

exports.createReview = async (reviewData, carId, user) => {
    const newReview = await ReviewModel({
        content: reviewData.content,
        rating: reviewData.rating,
        user: user.id,
        car: carId,
    });
    await newReview.save()
    await carService.updateCarRating(carId);

    return newReview;
}