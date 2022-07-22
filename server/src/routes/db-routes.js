const express = require("express");
const auth = require("../middleware/auth");
const rolesMiddleware = require("../middleware/role");
const dbController = require('../controllers/db-controller');

const router = express.Router();

router.post('/restore', dbController.restore);

router.post('/dump', dbController.dump);

router.get('/statistics', dbController.statistics);

module.exports = router;