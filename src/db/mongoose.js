const mongoose = require('mongoose');
const {MONGO_URL} = require('../utils/conf');

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = mongoose;