const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require('cors')

const { connectionToDB } = require('./db/mongoose');
const upload = require('./utils/multer');

const carTypeRoutes = require('./routes/carType');
const userRoutes = require('./routes/user');
const carImageRoutes = require('./routes/carImage');
const carRoutes = require('./routes/car');
const dbRoutes = require('./routes/db-routes');

const errorMiddleware = require('./middleware/error');

require('./utils/schedule')();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))


app.use('/carType', carTypeRoutes);
app.use('/user', userRoutes);
app.use('/carImage', upload.any() ,carImageRoutes);
app.use('/car', upload.any(), carRoutes);
app.use('/mongo/restore', dbRoutes);

app.use(errorMiddleware);

const start = async () => {
    try {
        await connectionToDB();
        app.listen(process.env.PORT, () => {
            console.log(`Server has been started on PORT = ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error.message);
    }
}

start();