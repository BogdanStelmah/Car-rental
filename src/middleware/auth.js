const UserModel = require('../models/User');
const tokenService = require('../service/token-servise');

const auth = async (req, res, next) => {
    try {
        const accesToken = req.header('Authorization').replace("Bearer ", "");
        const decoded = tokenService.validateAccesToken(accesToken);
        const user = await UserModel.findOne({_id: decoded._id});

        if (!user){
            throw new Error();
        }
        req.user = user;

        next();
    } catch (error) {
        res.status(401).send("Будь ласка авторизуйтесь");
    }
}

module.exports = auth;