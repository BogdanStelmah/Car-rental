const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rentalSchema = new Schema({
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
    deposit: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'PassportData'
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
},
    { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);