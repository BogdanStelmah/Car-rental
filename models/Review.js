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
    date: {
        type: Date,
        // default: new Date().toLocaleDateString()
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car'
    },
    versionKey: false
});

module.exports = mongoose.Model('Review', reviewSchema);s