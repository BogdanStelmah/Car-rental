const express = require('express');
const userControllers = require('../controllers/user');
const { body, param} = require('express-validator');
const auth = require('../middleware/auth');
const validationRes = require('../middleware/validationRes');
const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const authMiddleware = require("../middleware/auth");
const rolesMiddleware = require("../middleware/role");
const reviewController = require("../controllers/review");

const router = express.Router();

// GET /user
router.get('/', auth, userControllers.getUsers);

// POST /user/register
router.post('/register',
[
    body('email')
        .isEmail()
        .withMessage("Невірний формат email")
        .normalizeEmail()
        .custom(async value => {
            const user = await UserModel.findOne({ email: value });
            if (user) {
                throw Error("Даний email вже зайнятий");
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

// POST /user/login
router.post('/login', 
[
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage("Невірний формат email")
        .custom(async (value) => {
            const user = await UserModel.findOne({email:value});
            if (!user) {
                throw new Error('Неправильний email або пароль');
            }
        }),
    body('password')
        .trim()
        .custom(async (value, {req}) => {
            const user = await UserModel.findOne({email: req.body.email});
            const isMatch = await bcrypt.compare(value, user.password);
            if (!isMatch) {
                throw new Error('Неправильний email або пароль');
            }  
        }),
],
    validationRes, 
    userControllers.postLogin
);

// POST /user/logout
router.post('/logout', userControllers.postLogout);

// GET /user/refresh
router.get('/refresh', userControllers.getrefreshToken);

// GET /user/:userId/review
router.get('/:userId/review',
    [
        param('userId')
            .isMongoId().withMessage("Невірний формат id")
            .custom(async (value) => {
                const user = await UserModel.findOne({_id:value});
                if (!user) {
                    throw new Error('Даного користувача не існує');
                }
                return value;
            }),
    ],
    validationRes,
    authMiddleware, rolesMiddleware, reviewController.getUserReviews
);

// GET /user/myComments
router.get('/myComments', authMiddleware, reviewController.getMyComments);

module.exports = router;