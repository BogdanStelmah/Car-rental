const bcrypt = require('bcrypt');
const CustomError = require("../exceptions/custom-error");

//Models
const UserModel = require('../models/User');
const TokenModel = require('../models/Token');
const PassportDataModel = require('../models/PassportData');

//Services
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

const deleteUser = async(id) => {
    TokenModel.findOneAndDelete({ user: id })
    const user = await UserModel.findByIdAndDelete(id);

    if (user.passportData) {
        await PassportDataModel.findOneAndDelete(user.passportData);
    }

    return user;
}

const editUser = async(id, userData) => {
    const user = await UserModel.findById(id);
    const update = ['email', 'is_superuser'];
    update.forEach((update) => user[update] = userData[update]);
    await user.save();
}

const refresh = async(refreshToken) => {
    if (!refreshToken){
        throw CustomError.UnauthorizedError();
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

module.exports = {
    registration,
    login,
    logout,
    refresh,
    deleteUser,
    editUser
};
    