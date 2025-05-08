import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { home, logoutUser } from "../api/user/userService";
import { logOut } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    // If we already have user data in Redux, use it
    if (userData) {
      setUser(userData);
    } else {
      // Otherwise fetch from API
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
      // Call the logout API to clear cookies
      await logoutUser();

      // Clear user data from Redux
      dispatch(logOut());

      // Clear localStorage authentication flag
      localStorage.removeItem("userLoggedIn");

      toast.success("Logout successful");

      // Redirect to login page
      navigate("/users/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);

      // Even if the API call fails, still clear authentication state and redirect
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
            <img
              src={user.image || "/default-user.png"}
              alt="User Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <p className="text-lg font-medium">{user.name}</p>
            <p className="text-sm text-gray-300">{user.email}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
};

export default Home;
