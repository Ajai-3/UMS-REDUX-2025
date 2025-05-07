import React, { useState, useEffect } from "react";
import { editUser } from "../api/admin/adminService";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
}

interface EditUserModalProps {
  user: User | null;
  onClose: () => void;
  onUserUpdated: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onUserUpdated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?._id || !name || !email) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await editUser(user._id, name, email);
      
      if (response) {
        toast.success("User updated successfully!");
        onUserUpdated();
        onClose();
      }
    } catch (err: any) {
      console.error("Error updating user:", err);
      toast.error(err.message || "Error updating user");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

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
          <h2 className="text-xl font-semibold mb-4">Edit User</h2>
          
          <div className="flex items-center mb-4">
            <img 
              src={user.image} 
              alt={user.name} 
              className="w-16 h-16 rounded-full object-cover mr-4" 
            />
            <div>
              <p className="text-gray-400">User ID: {user._id}</p>
            </div>
          </div>
          
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
            className="w-full mb-4 px-4 py-2 rounded bg-zinc-700"
            required
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded text-white"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update User"}
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

export default EditUserModal;