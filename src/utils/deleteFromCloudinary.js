const ApiError = require("./ApiError");

const cloudinary = require("cloudinary").v2;

const deleteFromCloudinary = async(publicId) => {
    try {
        if(!publicId) return;

        const result = await cloudinary.uploader.destroy(publicId);

        return result;
    } catch (error) {
       throw new ApiError(500,error.message || "cloudinary delete error") ;
    }
}

module.exports = deleteFromCloudinary;