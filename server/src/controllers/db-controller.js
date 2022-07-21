const { restoreMongoDB, backupMongoDB } = require('../db/tools');

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

exports.dump = async (req, res, next) => {
    try {
        backupMongoDB();

        res.status(200).json({
            message: 'Dump is successful',
        })
    } catch (e) {
        next(e);
    }
}