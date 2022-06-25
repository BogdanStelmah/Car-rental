const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    is_superuser: {
        type: Boolean,
        default: false
    },
    passportData: {
        type: Schema.Types.ObjectId,
        ref: 'PassportData'
    },
    refreshToken: {
        type: String
    }
},
{ timestamps: true });

userSchema.statics.getTableFields = async () => {
    return {
        email: 'String',
        password: 'String',
        is_superuser: 'Boolean',
    }
}

module.exports = mongoose.model('User', userSchema);