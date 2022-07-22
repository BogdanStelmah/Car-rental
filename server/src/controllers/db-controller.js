const { restoreMongoDB, backupMongoDB } = require('../db/tools');
const dbService = require('../service/db-service');

exports.restore = async (req, res, next) => {
    try {
        await restoreMongoDB();

        res.status(200).json({
            message: 'Restore is successful',
        })
    } catch (e) {
        next(e);
    }
}

exports.dump = async (req, res, next) => {
    try {
        await backupMongoDB();

        res.status(200).json({
            message: 'Dump is successful',
        })
    } catch (e) {
        next(e);
    }
}

exports.statistics = async (req, res, next) => {
    try {
        const statisticsDB = await dbService.collectionSizes();

        res.status(200).json({
            message: 'Statistics successfully received',
            statistics: statisticsDB
        })
    } catch (e) {
        next(e);
    }
}