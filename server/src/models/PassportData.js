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
    address: {
        type: String,
    },
    phoneNumber: {
        type: String,
        minLength: 12,
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

passportDataSchema.statics.getTableFields = async () => {
    return {
        firstname: 'String',
        secondName: 'String',
        lastname: 'String',
        address: 'String',
        phoneNumber: 'String',
        authority: 'String',
        birthdate: 'String',
        imageLink: 'String',
    }
}

module.exports = mongoose.model('PassportData', passportDataSchema);