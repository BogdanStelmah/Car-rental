const { spawn,  } = require('child_process');
const path = require('path');
require('dotenv').config();

const ARCHIVE_PATH = path.join(__dirname, '../../dump', `${process.env.DB_NAME}.gzip`);
const COMMAND_MONGODUMP = 'C:\\Users\\dubin\\Desktop\\mongodb-database-tools\\bin\\mongodump.exe';
const COMMAND_MONGORESTORE = 'C:\\Users\\dubin\\Desktop\\mongodb-database-tools\\bin\\mongorestore.exe';

function backupMongoDB() {
    return new Promise((resolve, reject) => {
        const child = spawn(COMMAND_MONGODUMP, [
            `--uri=${process.env.MONGO_URL}`,
            `--archive=${ARCHIVE_PATH}`,
            `--gzip`
        ])
        child.on('close', (code, signal) => {
            if (code) console.log('Process exit with code: ', code);
            else if (signal) console.log('Process killed with signal: ', signal)
            else {
                console.log('Backup is successful');
                resolve();
            }
        })
    })
}

function restoreMongoDB() {
    return new Promise((resolve, reject) => {
        const child = spawn(COMMAND_MONGORESTORE, [
            `--uri=${process.env.MONGO_URL}`,
            `--archive=${ARCHIVE_PATH}`,
            `--gzip`
        ])
        child.on('close', (code, signal) => {
            if (code) console.log('Process exit with code: ', code);
            else if (signal) console.log('Process killed with signal: ', signal)
            else {
                console.log('Restore is successful');
                resolve();
            }
        })
    });
}

module.exports = { backupMongoDB, restoreMongoDB };