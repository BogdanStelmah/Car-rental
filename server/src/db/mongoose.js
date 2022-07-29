const mongoose = require('mongoose');
require('dotenv').config();

const connectionToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: 'admin'
        });
    } catch (e) {
        new Error('Помилка підключення до БД')
    }
}

module.exports = { connectionToDB };