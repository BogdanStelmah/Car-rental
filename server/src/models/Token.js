const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tokenShema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
    },
    refreshToken: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Token', tokenShema);