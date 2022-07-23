const express = require("express");
const authMiddleware = require("../middleware/auth");
const rolesMiddleware = require("../middleware/role");
const dbController = require('../controllers/db-controller');

const router = express.Router();

router.post('/restore', authMiddleware, rolesMiddleware, dbController.restore);

router.post('/dump', authMiddleware, rolesMiddleware, dbController.dump);

router.get('/statistics', authMiddleware, rolesMiddleware, dbController.statistics);

module.exports = router;