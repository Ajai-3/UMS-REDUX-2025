import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { home, logoutUser } from '../api/user/userService'

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null)

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
    await logoutUser();
    toast.success("Logout successful");
  }

  return (
    <div>
      <button onClick={handleLogOut} className='bg-red-600 px-3 py-1 text-xl rounded-md'>
        Logout
      </button>

      {user ? (
        <p>{user.name}</p> 
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Home;
