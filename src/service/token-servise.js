const { JWT_ACCESS_KEY, JWT_REFRESH_KEY } = require('../utils/conf');
const TokenModel = require('../models/Token');
const jwt = require('jsonwebtoken');

const generateTokens = (payload) => {
    const accesToken = jwt.sign({_id: payload.toString()}, JWT_ACCESS_KEY, {expiresIn: '30d'});
    const refreshToken = jwt.sign({_id: payload.toString()}, JWT_REFRESH_KEY, {expiresIn: '30d'});

    return {
        accesToken,
        refreshToken
    };
}

const saveToken = async (userId, refreshToken) => {
    const tokenData = await TokenModel.findOne({user: userId});

    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return await tokenData.save();
    }

    const token = await TokenModel.create({user: userId, refreshToken});
    return token;
}

const removeToken = async (refreshToken) => {
    await TokenModel.deleteOne({refreshToken});
}

const validateAccesToken = (token) => {
    try {
        const user = jwt.verify(token, JWT_ACCESS_KEY);
        return user;
    } catch (error) {
        return null;
    }
}

const validateRefreshToken = (token) => {
    try {
        const user = jwt.verify(token, JWT_REFRESH_KEY);
        return user;
    } catch (error) {
        return null;
    }
}

const findToken = async (refreshToken) => {
    return await TokenModel.findOne({refreshToken: refreshToken});
}

module.exports = { generateTokens, saveToken, removeToken, validateAccesToken, validateRefreshToken, findToken };