const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carTypeSchema = new Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        maxlength: 20
    },
    description: {
        type: String,
        required: true,
        maxlength: 400
    },
    versionKey: false
});

module.exports = mongoose.model('CarType', carTypeSchema);