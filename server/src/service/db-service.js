const { MongoClient } = require('mongodb')
require('dotenv').config()

class DbService {
    collections = {
        'rentals': 'Оренда',
        'users': 'Користувачі',
        'images': 'Картинки',
        'cartypes': 'Типи атомобілів',
        'reviews': 'Відгуки',
        'passportdatas': 'Паспортні дані',
        'cars': 'Автомобілі'
    }

    async collectionSizes() {
        const database = new MongoClient(process.env.MONGO_URL).db(process.env.DB_NAME)

        const keys = Object.keys(this.collections)

        let data = [];
        for (let i = 0; i < keys.length; i++) {
            const collection = database.collection(keys[i])
            const countDocuments = await collection.countDocuments();
            data.push({'nameCollection': this.collections[keys[i]], 'countDocuments': countDocuments})
        }

        return data;
    }

    async deleteDB() {
        const database = new MongoClient(process.env.MONGO_URL).db(process.env.DB_NAME)
        await database.dropDatabase();
    }
}

module.exports = new DbService();