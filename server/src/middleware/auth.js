const UserModel = require('../models/User');
const tokenService = require('../service/token-servise');
const CustomError = require("../exceptions/custom-error");

const auth = async (req, res, next) => {
    try {
        const accessToken = req.header('Authorization').replace("Bearer ", "");
        const decoded = tokenService.validateAccesToken(accessToken);
        const user = await UserModel.findOne({_id: decoded._id});

        if (!user){
            return next(CustomError.UnauthorizedError());
        }
        req.user = user;

        next();
    } catch (error) {
        return next(CustomError.UnauthorizedError());
    }
}

module.exports = auth;