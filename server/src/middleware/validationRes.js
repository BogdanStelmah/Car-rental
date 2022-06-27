const { validationResult } = require("express-validator");
const CustomError = require("../exceptions/custom-error");

module.exports = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(CustomError.BadRequestError('Помилка валідації', errors.array()));
    }
    next();
};