const CustomError = require("../exceptions/custom-error");

//Models
const PassportDataModel = require('../models/PassportData');

//Services
const cloudinaryService = require("../service/cloudinary-servise");
const imageService = require("./image-servise");

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

        console.log(imagesId)
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
}

module.exports = new PassportDataService();
