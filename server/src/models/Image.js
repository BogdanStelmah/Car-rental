const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
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

imageSchema.statics.getTableFields = async () => {
    return {
        imageLink: 'String',
        cloudinaryId: 'String'
    }
}

module.exports = mongoose.model('Image', imageSchema);