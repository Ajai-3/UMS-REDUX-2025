import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateUserProfile } from "../api/user/userService";
import { updateUser } from "../redux/slices/userSlice";
import { uploadImageToCloudinary } from "../utils/cloudinary";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
}

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  onClose,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user.image);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const dispatch = useDispatch();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);

      let imageUrl = user.image;
      if (imageFile) {
        setImageUploading(true);
        try {
          imageUrl = await uploadImageToCloudinary(imageFile);
        } catch (error: any) {
          toast.error("Failed to upload image: " + error.message);
          setIsLoading(false);
          setImageUploading(false);
          return;
        }
        setImageUploading(false);
      }

      const updatedUser = await updateUserProfile(name, email, imageUrl);

      dispatch(updateUser(updatedUser));

      toast.success("Profile updated successfully");
      onClose();
    } catch (error: any) {
      // Handle unauthorized errors
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userLoggedIn");
        window.location.href = "/users/login";
      } else {
        toast.error(error.message || "Failed to update profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-4">
            {imageUploading ? (
              <div className="w-24 h-24 rounded-full border border-gray-600 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview || "/default-avatar.png"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border border-gray-600"
                />
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  disabled={isLoading}
                />
                <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 text-xs text-white">
                  Edit
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-700 text-white rounded"
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-700 text-white rounded"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
              disabled={isLoading || imageUploading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
