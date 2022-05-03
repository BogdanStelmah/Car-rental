const express = require('express');

const PageController = require('../controllers/controller')
const router = express.Router();

router.get('/', PageController.getPage);

module.exports = router;