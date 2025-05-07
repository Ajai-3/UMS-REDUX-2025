import axios from 'axios';

const CLOUD_NAME = 'dnznxevrn';
const UPLOAD_PRESET = 'ums-redux';

export const uploadImageToCloudinary = async (imageFile: File) => {
  if (!imageFile) throw new Error("No image provided");

  const formData = new FormData();
  formData.append('file', imageFile); 
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    
    if (!res.data || !res.data.secure_url) {
      throw new Error("Failed to get image URL from Cloudinary");
    }
    
    return res.data.secure_url;
  } catch (err: any) {
    console.error("Cloudinary upload failed:", err);
    throw new Error("Image upload failed: " + (err.response?.data?.error?.message || err.message));
  }
};
