const express = require('express');

const auth = require('../middleware/auth');
const carImageController = require('../controllers/carImage');

const router = express.Router();

router.get('/', carImageController.getImages);

router.post('/', auth, carImageController.postImage);

router.delete('/:id', auth, carImageController.deleteImage);

module.exports = router;