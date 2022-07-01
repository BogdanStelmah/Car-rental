const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const ARCHIVE_PATH = path.join(__dirname, '../../dump', `${process.env.DB_NAME}.gzip`);
const COMMAND_MONGODUMP = 'C:\\Users\\dubin\\Desktop\\mongodb-database-tools\\bin\\mongodump.exe';
const COMMAND_MONGORESTORE = 'C:\\Users\\dubin\\Desktop\\mongodb-database-tools\\bin\\mongorestore.exe';

function backupMongoDB() {
    const child = spawn(COMMAND_MONGODUMP, [
        `--db=${process.env.DB_NAME}`,
        `--archive=${ARCHIVE_PATH}`,
        `--gzip`
    ])
    child.on('exit', (code, signal) => {
        if (code) console.log('Process exit with code: ', code);
        else if (signal) console.log('Process killed with signal: ', signal)
        else console.log('Backup is successful');
    })
}

function restoreMongoDB() {
    const child = spawn(COMMAND_MONGORESTORE, [
        `--db=${process.env.DB_NAME}`,
        `--archive=${ARCHIVE_PATH}`,
        `--gzip`
    ])
    child.on('exit', (code, signal) => {
        if (code) console.log('Process exit with code: ', code);
        else if (signal) console.log('Process killed with signal: ', signal)
        else console.log('Restore is successful');
    })

}

module.exports = { backupMongoDB, restoreMongoDB };