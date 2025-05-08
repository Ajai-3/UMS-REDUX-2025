import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { home, logoutUser } from "../api/user/userService";
import { logOut } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";
import EditProfileModal from "../components/EditProfileModal";

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.user.user);

  useEffect(() => {

    if (userData) {
      setUser(userData);
    } else {
      const fetchUserProfile = async () => {
        try {
          const data = await home();
          if (data) {
            setUser(data);
          } else {
            toast.error("User profile data is missing");
          }
        } catch (error) {
          toast.error("Failed to load user profile");
          console.error(error);
        }
      };

      fetchUserProfile();
    }
  }, [userData]);

  const handleLogOut = async () => {
    try {
      await logoutUser();
      dispatch(logOut());

      localStorage.removeItem("userLoggedIn");

      toast.success("Logout successful");

      navigate("/users/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);

      dispatch(logOut());
      localStorage.removeItem("userLoggedIn");
      navigate("/users/login");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center  text-white">
      <header className="w-full flex justify-between items-center px-10 py-4 bg-zinc-900 fixed top-0 shadow">
        <h1 className="text-2xl font-semibold">User Dashboard</h1>
        <button
          onClick={handleLogOut}
          className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
        >
          Logout
        </button>
      </header>

      <main className="mt-28 flex flex-col items-center space-y-4">
        {user ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="relative">
              <img
                src={user.image || "/default-user.png"}
                alt="User Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
            </div>
            <p className="text-lg font-medium">{user.name}</p>
            <p className="text-sm text-gray-300 mb-4">{user.email}</p>

            <button
              onClick={() => setShowEditModal(true)}
              className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        {showEditModal && user && (
          <EditProfileModal
            user={user}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default Home;
