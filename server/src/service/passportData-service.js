const CustomError = require("../exceptions/custom-error");

//Models
const PassportDataModel = require('../models/PassportData');
const UserModel = require("../models/User");

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


        const newData = new PassportDataModel({ ...data, imageLink: imagesId })
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

        this.updatePassportData(user.passportData, data, images)
    }

    async updatePassportData(id, data, images = []) {
        const update = {
            $set: {},
            $unset: {}
        }
        if (images.length !== 0) {
            const uploadedResponse = await cloudinaryService.uploadToCloudinary(
                images,
                process.env.UPLOAD_PRESET_FOR_PASSPORT_DATA
            );
            const imagesId = await imageService.saveImagesToDB(uploadedResponse);
            update.$set['imageLink'] = imagesId;
        }

        const updateFields = ['firstname', 'secondName', 'lastname', 'phoneNumber', 'birthdate', 'sex'];
        updateFields.forEach((filed) => {
            if (data[filed] !== undefined) {
                if (data[filed] === '') {
                    update.$unset[filed] = 1;
                    return
                }
                update.$set[filed] = data[filed]
            }
        });

        await PassportDataModel.findById(id).update(update);
    }

    async addImage(id, images) {
        const uploadedResponse = await cloudinaryService.uploadToCloudinary(images, process.env.UPLOAD_PRESET_FOR_PASSPORT_DATA);
        const imagesId = await imageService.saveImagesToDB(uploadedResponse);

        const passportData = await PassportDataModel.findById(id);
        passportData.imageLink.push(...imagesId);

        await passportData.save();
    }

    async deleteImage(id, idImage) {
        let passportData = await PassportDataModel.findById(id);
        await imageService.deleteImage(idImage);

        passportData.imageLink = passportData.imageLink.filter((image) => {return image._id.toString() !== idImage })
        await passportData.save();
    }
}

module.exports = new PassportDataService();
