const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload a base64 image to Cloudinary
 * @param {string} base64Data - Base64 encoded image (with or without data URL prefix)
 * @param {string} folder - Folder name in Cloudinary
 * @param {string} publicId - Optional public ID for the image
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadImage = async (base64Data, folder = 'profile_photos', publicId = null) => {
  try {
    // Ensure data URL format
    let dataUrl = base64Data;
    if (!base64Data.startsWith('data:')) {
      dataUrl = `data:image/jpeg;base64,${base64Data}`;
    }

    const uploadOptions = {
      folder: `manas_bandhan/${folder}`,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Max dimensions
        { quality: 'auto:good' }, // Auto quality optimization
        { fetch_format: 'auto' } // Auto format (WebP for supported browsers)
      ]
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
      uploadOptions.overwrite = true;
    }

    const result = await cloudinary.uploader.upload(dataUrl, uploadOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<boolean>}
 */
const deleteImage = async (publicId) => {
  try {
    if (!publicId) return false;
    
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null}
 */
const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{folder}/{public_id}.{format}
    const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
    return matches ? matches[1] : null;
  } catch (error) {
    return null;
  }
};

/**
 * Check if a string is a Cloudinary URL
 * @param {string} str 
 * @returns {boolean}
 */
const isCloudinaryUrl = (str) => {
  return str && typeof str === 'string' && str.includes('cloudinary.com');
};

/**
 * Check if a string is a base64 data URL
 * @param {string} str 
 * @returns {boolean}
 */
const isBase64DataUrl = (str) => {
  return str && typeof str === 'string' && str.startsWith('data:image');
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  getPublicIdFromUrl,
  isCloudinaryUrl,
  isBase64DataUrl
};
