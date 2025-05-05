import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { dashboard, deleteUser, logoutAdmin } from "../api/admin/adminService";

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboard(search);
        setUsers(data.users);
      } catch (error) {
        toast.error("Failed to load users");
      }
    };
    fetchData();
  }, [search]);

  const handleDeleteClick = (id: string) => {
    setSelectedUserId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedUserId) {
      try {
        await deleteUser(selectedUserId);
        setUsers(users.filter((user) => user._id !== selectedUserId)); // Remove deleted user
        toast.success("User deleted");
      } catch {
        toast.error("Failed to delete user");
      }
      setShowConfirm(false);
      setSelectedUserId(null);
    }
  };

  const handleAdminLogout = async() => {
    try {
         await logoutAdmin();
        toast.success("Logged out successfully")
      } catch (error) {
        toast.error("Failed to logout");
      }
  }

  return (
    <div className="h-screen text-white">
      <div className="flex justify-between items-center px-32 py-4 fixed left-0 right-0 top-0 bg-zinc-900 z-10 shadow-md">
        <h1 className="font-semibold text-2xl">DASHBOARD</h1>
        <button onClick={handleAdminLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">
          Logout
        </button>
      </div>

      <div className="pt-24 px-72">
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users"
            className="px-4 py-2 rounded-md bg-zinc-700 flex-grow"
          />
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md">
            Add New User
          </button>
        </div>

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
            {users.length ? (
              users.map((user, i) => (
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
                    <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user._id)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm mx-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-zinc-800 rounded p-4 py-10"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <p className="mb-4">Are you sure you want to delete this user?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-pink-600 text-white px-4 py-1 rounded"
                  onClick={confirmDelete}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-400 px-4 py-1 rounded"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
