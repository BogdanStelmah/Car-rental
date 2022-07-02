const User = require('../models/User');
const userService = require('../service/user-service');

exports.getUsers = async (req, res, next) => {
    await User.find()
        .then(users => {
            res.status(200).json({
                message: "Fetched posts successfully.",
                users: users
            })
        })
        .catch(error => {
            next(error);
        });
}

exports.postRegister = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await userService.registration(email, password);

        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return res.json(userData);
    } catch (error) {
        next(error);
    }
}

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await userService.login(email, password);

        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return res.json(userData);
    } catch (error) {
        next(error);
    }
}

exports.postLogout = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies;
        await userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.status(200).send('Logout...');
    } catch (error) {
        next(error);
    }
}   

exports.getrefreshToken = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies;
        const userData = await userService.refresh(refreshToken);

        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return res.json(userData);
    } catch (error) {
        return res.status(401)
    }
}