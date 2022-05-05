const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// const validator = require('validator');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: String,
        minLength: 12,
    },
    password: {
        type: String,
        required: true,
        minLength: 20,
        // validator(value) {
        //     if (value.toLowerCase().includes('password')) {
        //         throw new Error('Пароль містить слово “password”');
        //     }
        // }
    },
    is_superuser: {
        type: Boolean,
        default: false
    },
    passportData: {
        type: Schema.Types.ObjectId,
        ref: 'PassportData'
    },
    versionKey: false // __v
});

module.exports = mongoose.model('User', userSchema);