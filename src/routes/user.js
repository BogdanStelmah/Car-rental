const express = require('express');
const userControllers = require('../controllers/user');
const { body } = require('express-validator');
const auth = require('../middleware/auth')

const router = express.Router();

// GET /users
router.get('/', auth, userControllers.getUsers);

// POST /users/register
router.post('/register',
    body('email').isEmail(),
    body('password').isLength({min: 8,  max: 32}),
    userControllers.postRegister
);

// POST /users/login
router.post('/login', userControllers.postLogin);

// POST /users/logout
router.post('/logout', userControllers.postLogout);

// GET /users/refresh
router.get('/refresh', userControllers.getrefreshToken);

module.exports = router;
