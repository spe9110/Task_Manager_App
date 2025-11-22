// controllers/cloudinary_controller.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import logger from "../config/logging.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "avatars",
    });

    logger.info("Uploaded to Cloudinary:", result.secure_url);

    // delete local file
    fs.unlinkSync(localFilePath);

    return result.secure_url;

  } catch (error) {
    logger.error("Cloudinary Upload Error:", error);
    fs.unlinkSync(localFilePath);
    throw error;
  }
};


/*
import { v2 as cloudinary } from 'cloudinary';
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
import logger from "../config/logging.js";

// Configuration
cloudinary.config({ 
    cloud_name: CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
   
// Upload an image
const uploadResult = async imagePath => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    }
    try {
        const result = await cloudinary.uploader.upload(imagePath, options);
        logger.info('File uploaded to Cloudinary successfully:', result.secure_url);
        return result.secure_url;
    } catch (error) {
        logger.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

export const uploadImage = async (req, res, next) => {
    try {
        const { data, mimeType } = req.file.image;
        const base64String = Buffer.from(data).toString('base64');
        const withPrefix = `data:${mimeType};base64,${base64String}`;
        const imageUrl = await uploadResult(withPrefix);
        return res.status(200).json({ status: "success", imageUrl });
    } catch (error) {
        next({ status: 500, message: "Image upload failed", error });   
    }
}
*/