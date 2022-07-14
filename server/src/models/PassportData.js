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
    phoneNumber: {
        type: String,
        minLength: 12,
    },
    sex: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    imageLink: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
});

passportDataSchema.statics.getTableFields = async () => {
    return {
        firstname: 'String',
        secondName: 'String',
        lastname: 'String',
        phoneNumber: 'String',
        sex: 'String',
        birthdate: 'Date',
    }
}

module.exports = mongoose.model('PassportData', passportDataSchema);