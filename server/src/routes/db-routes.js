const express = require("express");
const auth = require("../middleware/auth");
const rolesMiddleware = require("../middleware/role");
const dbController = require('../controllers/db-controller');

const router = express.Router();

router.post('/', dbController.restore);

module.exports = router;