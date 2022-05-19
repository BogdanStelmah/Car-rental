const express = require('express');
const cookieParser = require('cookie-parser');
require('./db/mongoose');
const { PORT } = require('./utils/conf');

const carTypeRoutes = require('./routes/carType');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use('/carType', carTypeRoutes);
app.use('/users', userRoutes);

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server has been started on PORT = ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
    
}

start();