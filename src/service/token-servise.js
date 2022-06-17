require('dotenv').config();
const TokenModel = require('../models/Token');
const jwt = require('jsonwebtoken');

const generateTokens = (payload) => {
    const accesToken = jwt.sign({
        _id: payload.toString()},
        process.env.JWT_ACCESS_KEY,
        {expiresIn: '30d'});

    const refreshToken = jwt.sign({
        _id: payload.toString()},
        process.env.JWT_REFRESH_KEY,
        {expiresIn: '30d'});

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

    return await TokenModel.create({user: userId, refreshToken});
}

const removeToken = async (refreshToken) => {
    await TokenModel.deleteOne({refreshToken});
}

const validateAccesToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_KEY);
    } catch (error) {
        return null;
    }
}

const validateRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_KEY);
    } catch (error) {
        return null;
    }
}

const findToken = async (refreshToken) => {
    return await TokenModel.findOne({refreshToken: refreshToken});
}

module.exports = { generateTokens, saveToken, removeToken, validateAccesToken, validateRefreshToken, findToken };