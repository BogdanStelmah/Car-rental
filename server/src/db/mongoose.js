const mongoose = require('mongoose');
const path = require("path");
require('dotenv').config();

const connectionToDB = async () => {
    await mongoose.connect(process.env.MONGO_URL + process.env.DB_NAME, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = { connectionToDB };