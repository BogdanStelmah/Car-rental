//Models
const CarTypeModel = require('./CarType');

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
    rating: {
        type: Number,
        required: true,
        default: 5,
        min: 0,
        max: 5
    },
    carImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    carType: {
        type: Schema.Types.ObjectId,
        ref: 'CarType'
    },
    status: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    versionKey: false
});

carSchema.statics.getTableFields = async () => {
    return {
        name: 'String',
        brand: 'String',
        modelYear: 'Number',
        description: 'String',
        color: 'String',
        numberPeople: 'Number',
        number: 'String',
        rating: 'Number',
        status: 'Boolean',
        price: 'Number',
        carType: await CarTypeModel.getTableFields()
    }
}

module.exports = mongoose.model('Car', carSchema);