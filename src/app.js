const express = require('express');
const cookieParser = require('cookie-parser');
require('./db/mongoose');
const { PORT } = require('./utils/conf');
const multer = require('multer');
const path = require('path');

const carTypeRoutes = require('./routes/carType');
const userRoutes = require('./routes/user');
const carImageRoutes = require('./routes/carImage');

const app = express();


const storage = multer.diskStorage({
    destination (req, file, cb) {
        cb(null, 'images');
    },
    filename (req, file, cb) {
        cb(null, new Date().toLocaleString().replaceAll(/[\s.,:%]/g, '') + "." + file.mimetype.split('/')[1]);
    }
})

const fileFilter = (req, file, cb) => {
    if( file.mimetype === "image/png" || file.mimetype === "image/jpg"|| file.mimetype === "image/jpeg" ){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(express.json());
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, '../images')))

app.use( multer({ storage: storage, fileFilter: fileFilter }).single('image') );

app.use('/carType', carTypeRoutes);
app.use('/users', userRoutes);
app.use('/carImage', carImageRoutes);

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