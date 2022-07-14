const CustomError = require("../exceptions/custom-error");

//Models
const PassportDataModel = require('../models/PassportData');

//Services
const cloudinaryService = require("../service/cloudinary-servise");
const imageService = require("./image-servise");
const UserModel = require("../models/User");

class PassportDataService {
    async getPassportsData() {
        return await PassportDataModel.find();
    }

    async getPassportData(id) {
        const passportData = await PassportDataModel.findById(id).populate('imageLink');

        if(!passportData) {
            throw CustomError.BadRequestError('Даного документу не знайдено');
        }

        return passportData;
    }

    async createPassportData(data, images) {
        const uploadedResponse = await cloudinaryService.uploadToCloudinary(
            images,
            process.env.UPLOAD_PRESET_FOR_PASSPORT_DATA
        );
        const imagesId = await imageService.saveImagesToDB(uploadedResponse);

        const newData = new PassportDataModel({
            firstname: data.firstname,
            secondName: data.secondName,
            lastname: data.lastname,
            phoneNumber: data.phoneNumber,
            sex: data.sex,
            birthdate: data.birthdate,
            imageLink: imagesId,
        })
        await newData.save();

        return newData;
    }

    async addPassportDataToUser(idUser, data, images) {
        const user = await UserModel.findById(idUser);

        let passportData;
        if (!user.passportData) {
            passportData = await this.createPassportData(data, images);
            user.passportData = passportData._id;
            await user.save();
            return;
        }

        const uploadedResponse = await cloudinaryService.uploadToCloudinary(
            images,
            process.env.UPLOAD_PRESET_FOR_PASSPORT_DATA
        );
        const imagesId = await imageService.saveImagesToDB(uploadedResponse);

        passportData = await PassportDataModel.findById(user.passportData);
        passportData.imageLink = imagesId;
        const update = ['firstname', 'secondName', 'lastname', 'phoneNumber', 'birthdate', 'sex'];
        update.forEach((update) => passportData[update] = data[update]);

        await passportData.save();
    }
}

module.exports = new PassportDataService();
