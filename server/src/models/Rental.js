//Models
const PassportDataModel = require('./PassportData');
const UserModel = require('./User');
const CarModel = require('./Car');

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

rentalSchema.statics.getTableFields = async () => {
    return {
        rentalPeriod: 'Number',
        returnDate: 'Date',
        paymentAmount: 'Number',
        deposit: 'Number',
        user: await PassportDataModel.getTableFields(),
        car: await CarModel.getTableFields(),
        admin: await UserModel.getTableFields(),
        status: 'Boolean',
        createdAt: 'Date',
    }
}

module.exports = mongoose.model('Rental', rentalSchema);