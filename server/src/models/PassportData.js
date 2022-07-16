const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passportDataSchema = new Schema({
    firstname: {
        type: String,
    },
    secondName: {
        type: String,
    },
    lastname: {
        type: String,
    },
    phoneNumber: {
        type: String,
        minLength: 12,
    },
    sex: {
        type: String,
    },
    birthdate: {
        type: Date,
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