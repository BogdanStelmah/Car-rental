const { restoreMongoDB } = require('../db/tools');

exports.restore = async (req, res, next) => {
    try {
        restoreMongoDB();

        res.status(200).json({
            message: 'Restore is successful',
        })
    } catch (e) {
        next(e);
    }
}