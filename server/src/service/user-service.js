const bcrypt = require('bcrypt');
const UserModel = require('../models/User');
const tokenService = require('../service/token-servise');

const registration = async (email, password) => {
    const hashPassword = await bcrypt.hash(password, 8);
 
    const user = await UserModel.create({email: email, password: hashPassword});
    const tokens = tokenService.generateTokens(user._id);
    await tokenService.saveToken(user._id, tokens.refreshToken);

    return {...tokens, user};
}

const login = async (email, password) => {
    const user = await UserModel.findOne({email});
    const tokens = tokenService.generateTokens(user._id);
    await tokenService.saveToken(user._id, tokens.refreshToken);

    return {...tokens, user};
}

const logout = async(refreshToken) => {
    await tokenService.removeToken()
}

const refresh = async(refreshToken) => {
    if (!refreshToken){
        throw Error("Користувач неавторизований");
    }

    const userId = tokenService.validateRefreshToken(refreshToken);
    const token = await tokenService.findToken(refreshToken);
    if (!userId || !token){
        throw Error("Помилка авторизації")
    }

    const user = await UserModel.findById(userId);
    const tokens = tokenService.generateTokens(user._id);
    await tokenService.saveToken(user._id, tokens.refreshToken);

    return {...tokens, user};
}

module.exports = { registration, login, logout, refresh };
    