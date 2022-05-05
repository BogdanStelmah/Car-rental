const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carTypeSchema = new Schema({
    carType: {
        type: String,
        required: true,
        unique: true,
        maxlength: 20
    },
    description: {
        type: String,
        required: true,
        maxlength: 100
    },
    versionKey: false
});

module.exports = mongoose.Model('CarType', carTypeSchema);