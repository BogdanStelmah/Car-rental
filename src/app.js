const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { connectionToDB } = require('./db/mongoose');
const upload = require('./utils/multer');

const carTypeRoutes = require('./routes/carType');
const userRoutes = require('./routes/user');
const carImageRoutes = require('./routes/carImage');
const carRoutes = require('./routes/car');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

app.use('/carType', carTypeRoutes);
app.use('/users', userRoutes);
app.use('/carImage', upload.any() ,carImageRoutes);
app.use('/car', upload.any() ,carRoutes);

const start = async () => {
    try {
        await connectionToDB();
        app.listen(process.env.PORT, () => {
            console.log(`Server has been started on PORT = ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();