const {cloudinary} = require("../utils/cloudinary");
require('dotenv').config()

const uploadToCloudinary = async (files, directoryName) => {
    const resultUploaded = [];

    for (const file of files) {
        const uploadedResponse = await cloudinary.uploader.upload(
            file.path,
            {
                upload_preset: directoryName
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

const getAllAssetsInFolder = async (directoryName) => {
    const assets = await cloudinary.search.expression(`folder:${directoryName}`).execute()

    return assets.resources.map((file) => {return {public_id: file.public_id, created_at: file.created_at}});
}

module.exports = { uploadToCloudinary, deleteFromCloudinary, getAllAssetsInFolder }