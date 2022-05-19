const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carImageSchema = new Schema({
    imageLink: {
        type: String,
        required: true
    },
    versionKey: false
});

module.exports = mongoose.model('CarImage', carImageSchema);