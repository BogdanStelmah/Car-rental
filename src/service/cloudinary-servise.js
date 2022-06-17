const {cloudinary} = require("../utils/cloudinary");
require('dotenv').config()

const uploadToCloudinary = async (files) => {
    const resultUploaded = [];

    for (const file of files) {
        const uploadedResponse = await cloudinary.uploader.upload(
            file.path,
            {
                upload_preset: process.env.UPLOAD_PRESET_FOR_CAR_IMAGES
            }
        )
        resultUploaded.push(uploadedResponse);
    }

    return resultUploaded;
}

const deleteFromCloudinary = async (file) => {
    const destroyResponse = await cloudinary.uploader.destroy(
        file.cloudinaryId,
    )
}

module.exports = { uploadToCloudinary, deleteFromCloudinary }