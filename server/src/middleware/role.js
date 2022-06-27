const tokenService = require("../service/token-servise");
const UserModel = require("../models/User");
const CustomError = require("../exceptions/custom-error");

module.exports = async function (req, res, next) {
    try {
        const accessToken = req.header('Authorization').replace("Bearer ", "");
        const decoded = tokenService.validateAccesToken(accessToken);
        const user = await UserModel.findOne({_id: decoded._id});

        if (!user.is_superuser) {
            next(CustomError.AccessDeniedError());
        }

        next();
    } catch (error) {
        next(CustomError.BadRequestError('Помилка валідації', errors.array()));
    }
}