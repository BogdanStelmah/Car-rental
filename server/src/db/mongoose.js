const mongoose = require('mongoose');
require('dotenv').config();

const connectionToDB = async () => {
    await mongoose.connect(process.env.MONGO_URL + process.env.DB_NAME, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = { connectionToDB };