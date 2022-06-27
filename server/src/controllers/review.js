//Models
const ReviewModel = require('../models/Review');
//Services
const reviewService = require('../service/review-servise');
const carService = require('../service/car-servise');

exports.getMyComments = async (req, res, next) => {
    try {
        const reviews = await reviewService.getReviewsByUserId(req.user.id);

        res.status(200).json({
            message: "Fetched posts successfully.",
            review: reviews
        })
    } catch (error) {
        next(error);
    }
}

exports.getUserReviews = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const reviews = await reviewService.getReviewsByUserId(userId);

        res.status(200).json({
            message: "Fetched posts successfully.",
            review: reviews
        })
    } catch (error) {
        next(error);
    }
}

exports.getCarReviews = async (req, res, next) => {
    try {
        const carId = req.params.id;
        const reviews = await reviewService.getReviewsByCarId(carId);

        res.status(200).json({
            message: "Fetched posts successfully.",
            review: reviews
        })
    } catch (error) {
        next(error);
    }
}

exports.postReview = async (req, res, next) => {
    try {
        const reviewData = req.body;
        const carId = req.params.id;
        const newReview = await reviewService.createReview(reviewData, carId, req.user);
        carService.updateCarRating(carId);

        res.status(201).json({
            message: "Comment created successfully",
            review: newReview
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteReview = async (req, res, next) => {
    try {
        const reviewId = req.params.idReview
        const deletedReview = await ReviewModel.findByIdAndDelete(reviewId)
        carService.updateCarRating(deletedReview.car);
        res.status(201).json({
            message: "Comment successfully deleted",
        });
    } catch (error) {
        next(error);
    }
}