const express = require('express');
const userControllers = require('../controllers/user');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validationRes = require('../middleware/validationRes');
const UserModel = require('../models/User');
const bcrypt = require('bcrypt');

const router = express.Router();

// GET /users
router.get('/', auth, userControllers.getUsers);

// POST /users/register
router.post('/register',
[
    body('email')
        .isEmail()
        .withMessage("Невірний формат email")
        .normalizeEmail()
        .custom(async value => {
            const user = await UserModel.findOne({ email: value });
            if (user) {
                throw Error("Даний email вже занятий");
            } else {
                return value;
            }
        }),
    body('password')
        .isLength({ min: 8 })
        .withMessage("Мінімальний розмір паролю 8 символів")
        .isLength({ max: 32 })
        .withMessage("Максимальна довжина паролю 32 символи")
        .trim(),
    body('confirmPassword')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw Error("Паролі не збігаються");
            } else {
                return value;
            }
        }),
],
    validationRes,
    userControllers.postRegister
);

// POST /users/login
router.post('/login', 
[
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage("Невірний формат email")
        .custom(async (value) => {
            const user = await UserModel.findOne({email:value});
            if (!user) {
                throw new Error('Невірний email або пароль');
            }
        }),
    body('password')
        .isLength({ min: 8 })
        .withMessage("Мінімальний розмір паролю 8 символів")
        .isLength({ max: 32 })
        .withMessage("Максимальна довжина паролю 32 символи")
        .trim()
        .custom(async (value, {req}) => {
            const user = await UserModel.findOne({email: req.body.email});
            const isMatch = await bcrypt.compare(value, user.password);
            if (!isMatch) {
                throw new Error('Невірний email або пароль');
            }  
        }),
],
    validationRes, 
    userControllers.postLogin
);

// POST /users/logout
router.post('/logout', userControllers.postLogout);

// GET /users/refresh
router.get('/refresh', userControllers.getrefreshToken);

module.exports = router;