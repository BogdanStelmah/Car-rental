const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/CarRental', {
    useNewUrlParser: true
});

module.exports = mongoose;