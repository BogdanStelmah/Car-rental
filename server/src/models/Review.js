const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    content: {
        type: String,
        required: true,
        maxlength: 100
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'PassportData'
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car'
    },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);