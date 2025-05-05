import axios from 'axios';

const CLOUD_NAME = 'dnznxevrn';
const UPLOAD_PRESET = 'ums-redux';

export const uploadImageToCloudinary = async (imageFile: File) => {
  if (!imageFile) throw new Error("No image provided");

  const formData = new FormData();
  formData.set('file', imageFile); 
  formData.set('upload_preset', UPLOAD_PRESET);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    return res.data.secure_url;
  } catch (err: any) {
    console.error("Upload failed:", err);
    throw err;
  }
};
