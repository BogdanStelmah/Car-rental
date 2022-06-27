const CustomError = require('../exceptions/custom-error');

module.exports = function (err, req, res, next) {
    console.error(err.message);

    if (err instanceof CustomError) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors
        })
    }

    return res.status(500).json({
        message: 'Помилка сервера',
        error: err.message
    })
}