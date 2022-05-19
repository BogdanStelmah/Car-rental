const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    modelYear: {
        type: Number,
        required: true,
        min: 1970,
        max: 2022
    },
    description: {
        type: String,
        required: true,
        maxlength: 100
    },
    color: {
        type: String,
        required: true
    },
    numberPeople: {
        type: Number,
        required: true,
        maxlength: 12
    },
    number: {
        type: Number,
        required: true,
        min: 1,
        max: 30
    },
    // rate: {
    //     type: String,
    //     required: true
    // },
    
    carImages: [{ type: Schema.Types.ObjectId, ref: 'CarImage' }],
    carType: {
        type: Schema.Types.ObjectId,
        ref: 'CarType'
    },
    status: {
        type: Boolean,
        default: false
    },
    versionKey: false
});

module.exports = mongoose.model('Car', carSchema);