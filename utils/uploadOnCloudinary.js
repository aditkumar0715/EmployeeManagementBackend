const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.uploadOnCloudinary = async (localFilePath, folder, height, quality) => {
  try {
    if (!localFilePath) return null;
    const options = { folder };

    if (height) {
      options.height = height;
    }

    if (quality) {
      options.quality = quality;
    }

    // upload to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, options);
    console.log(response);
    return response.url;
  } catch (error) {
    console.log("Error while uploading file to cloudinary", error);
    fs.unlink(localFilePath); // remove the locally stored file
    return null;
  }
};
