const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passportDataSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    secondName: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    authority: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    birthdate: {
        type: String,
        required: true
    },
    imageLink: {
        type: String,
        required: true
    },
    versionKey: false // __v
});

module.exports = mongoose.model('PassportData', passportDataSchema);