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
        min: new Date().getFullYear() - 80,
        max: new Date().getFullYear()
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
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
        type: String,
        required: true,
        min: 1,
        max: 10
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