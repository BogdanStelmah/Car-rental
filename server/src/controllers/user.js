const User = require('../models/User');
const userService = require('../service/user-service');
const CustomError = require("../exceptions/custom-error");
const {queryParser} = require("../utils/queryParser");
const UserModel = require('../models/User');
const RentalModel = require('../models/Rental');

exports.getUsers = async (req, res, next) => {
    try {
        const { limit, skip, sort, filters } = await queryParser(req.query, User);

        const query = [
            {
                $lookup:
                    {
                        from: 'passportdatas',
                        localField: 'passportData',
                        foreignField: '_id',
                        as: 'passportData'
                    }
            },
            {
                $match: filters
            },
        ]

        let count = await User
            .aggregate(query.concat([
                {
                    $count: 'countDocuments'
                }
            ]))
        count = count[0]?.countDocuments;
        const totalPages = Math.ceil(count / limit);


        if (sort) {
            query.push({ $sort: sort });
        }
        query.push({ $skip: skip });
        query.push({ $limit: limit });

        const users = await User
            .aggregate(query)

        res.status(200).json({
            message: "Fetched posts successfully.",
            users: users,
            page: skip,
            totalCount: count,
            totalPages: totalPages
        })
    } catch (e) {
        next(e);
    }
}

exports.postRegister = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await userService.registration(email, password);

        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
}

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await userService.login(email, password);

        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
}

exports.postLogout = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies;
        await userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.status(200).send('Logout...');
    } catch (error) {
        next(error);
    }
}   

exports.getrefreshToken = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies;
        const userData = await userService.refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (req.user._id.toString() === userId) {
            throw CustomError.BadRequestError('?????????????????? ???????????????? ????????')
        }

        userService.deleteUser(userId);

        res.status(200).json({
            message: "?????????????? ???????????????? ??????????????????????"
        })
    } catch (e) {
        next(e);
    }
}

exports.editUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        userService.editUser(userId, req.body);

        res.status(200).json({
            message: "???????? ????????????????"
        })
    } catch (e) {
        next(e);
    }
}

exports.countUserByRole = async (req, res, next) => {
    try {
        let countUser = await UserModel.aggregate([
            {
                $group: {
                    _id: "$is_superuser",
                    count: {
                        $count: {}
                    }
                }
            }
        ])

        countUser = countUser.map((data) => {
            return {...data, _id: data._id ? '??????????' : '????????????????'}
        })

        res.status(200).json({
            countUser: countUser
        })
    } catch (e) {
        next(e);
    }
}

exports.topUsersForRentals = async (req, res, next) => {
    try {
        let topUsers = await RentalModel.aggregate([{
            $group: {
                _id: "$admin",
                count: { $count: {} }
            }
        }, {
            $sort: { count: -1 }
        }, {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: '_id'
            }
        },
        ])

        topUsers.map((data) => {
            return data._id = data._id[0]?.email || '?????????????????? ????????????????????'
        })

        res.status(200).json({
            topUsers: topUsers
        })
    } catch (e) {
        next(e);
    }
}