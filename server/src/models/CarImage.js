const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carImageSchema = new Schema({
    imageLink: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    versionKey: false
});

carImageSchema.statics.getTableFields = async () => {
    return {
        imageLink: 'String',
        cloudinaryId: 'String'
    }
}

module.exports = mongoose.model('CarImage', carImageSchema);