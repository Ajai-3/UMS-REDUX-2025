import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import { dashboard, deleteUser, logoutAdmin } from "../api/admin/adminService";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await dashboard(search);
      setUsers(data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedUserId(id);
    setShowConfirm(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    if (selectedUserId) {
      try {
        await deleteUser(selectedUserId);
        setUsers(users.filter((user) => user._id !== selectedUserId));
        toast.success("User deleted");
      } catch {
        toast.error("Failed to delete user");
      }
      setShowConfirm(false);
      setSelectedUserId(null);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await logoutAdmin();

      // Clear localStorage authentication flag
      localStorage.removeItem("adminAuth");

      toast.success("Logged out successfully");
      // Redirect to login page
      navigate("/admin/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const refreshUsers = async () => {
    try {
      const data = await dashboard(search);
      setUsers(data.users);
    } catch {
      toast.error("Failed to refresh users");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleAdminLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="flex w-full mb-6 gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded bg-gray-800 w-full"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded whitespace-nowrap"
          >
            Add User
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 bg-gray-800 rounded">
            <p className="text-xl">No users found</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={i} className="border-t border-gray-600">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2 flex gap-4 items-center">
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-14 h-14 object-cover rounded-full"
                      />
                      {user.name}
                    </td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm mr-2"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user._id)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AddUserModal
              onClose={() => setShowAddModal(false)}
              onUserAdded={refreshUsers}
            />
          </motion.div>
        )}

        {showEditModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EditUserModal
              user={selectedUser}
              onClose={() => {
                setShowEditModal(false);
                setSelectedUser(null);
              }}
              onUserUpdated={refreshUsers}
            />
          </motion.div>
        )}

        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl mb-4">Confirm Delete</h3>
              <p className="mb-6">Are you sure you want to delete this user?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
