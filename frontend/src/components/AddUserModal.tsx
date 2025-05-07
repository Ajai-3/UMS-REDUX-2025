import React, { useState } from "react";
import { createUser } from "../api/admin/adminService";
import { toast } from "react-toastify";
import { uploadImageToCloudinary } from "../utils/cloudinary"; 

interface AddUserModalProps {
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (!imageFile) {
      toast.error("Please select an image file.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
      return;
    }

    try {
      setIsLoading(true);

      setImageUploading(true);
      let imageUrl;
      try {
        imageUrl = await uploadImageToCloudinary(imageFile);
        setImageUploading(false);
      } catch (uploadErr: any) {
        console.error("Image upload error:", uploadErr);
        toast.error("Image upload failed: " + uploadErr.message);
        setIsLoading(false);
        setImageUploading(false);
        return;
      }
      
      try {
        const response = await createUser(name, email, imageUrl, password);
        
        if (response) {
          toast.success("User created successfully!");
          setName("");
          setEmail("");
          setImageFile(null);
          setPassword("");
          onUserAdded();
          onClose();
        }
      } catch (createErr: any) {
        console.error("User creation error:", createErr);
        toast.error(createErr.message || "Error creating user");
      }
    } catch (err: any) {
      console.error("General error:", err);
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setImageUploading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-zinc-800 p-6 rounded-lg w-full max-w-md" 
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-3 px-4 py-2 rounded bg-zinc-700"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 px-4 py-2 rounded bg-zinc-700"
            required
          />
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full mb-3 px-4 py-2 rounded bg-zinc-700"
            accept="image/*"
            required
          />
          <input
            type="password"
            placeholder="Password (8+ chars with upper, lower, number, special)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded bg-zinc-700"
            required
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded text-white"
              disabled={isLoading || imageUploading}
            >
              {isLoading ? "Creating..." : imageUploading ? "Uploading..." : "Create User"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
