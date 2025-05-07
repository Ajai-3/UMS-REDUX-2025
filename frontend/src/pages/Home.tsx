import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { home, logoutUser } from '../api/user/userService';

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await home();
        if (data) {
          setUser(data);
        } else {
          toast.error('User profile data is missing');
        }
      } catch (error) {
        toast.error('Failed to load user profile');
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogOut = async () => {
    try {
      await logoutUser();
      toast.success('Logout successful');
      // Optional: redirect user or refresh
    } catch (error) {
      toast.error('Logout failed');
      console.error(error);
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
              src={user.image || '/default-user.png'}
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
