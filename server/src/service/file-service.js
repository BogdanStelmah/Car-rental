import path from "path";
import fs from "fs";
require('dotenv').config();

class FileService {
    async deleteDump() {
        const PATH = path.join(__dirname, '../../dump', `${process.env.DB_NAME}.gzip`);
        await fs.unlink(PATH, () => {});
    }
}

module.exports = new FileService();