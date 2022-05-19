const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rentalSchema = new Schema({
    rentalDate: {
        type: Date,
        required: true
    },
    rentalPeriod: {
        type: Number,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    paymentAmount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
    },
    deposit: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car'
    },
    admin:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Boolean,
        default: false
    },
    versionKey: false
});

module.exports = mongoose.model('Rental', rentalSchema);