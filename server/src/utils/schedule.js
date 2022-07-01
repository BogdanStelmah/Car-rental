const schedule = require('node-schedule');
const { backupMongoDB } = require('../db/tools');

module.exports = () => schedule.scheduleJob('0 0 * * 0', function(){
    backupMongoDB();
});