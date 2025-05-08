import axiosInstance from "../axios";

//===========================================================================================================
// REGISTER USER
//===========================================================================================================
export const registerUser = async (
  name: string,
  email: string,
  image: string,
  password: string
) => {
  try {
    if (!name || !email || !image || !password) {
      throw new Error("All fields are required");
    }

    const response = await axiosInstance.post("/users/register", {
      name,
      email,
      image,
      password,
    });

    return response.data;
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error);

    if (error.response) {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message[0]
        : error.response.data.message || "Registration failed";
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw error;
    }
  }
};

//===========================================================================================================
// USER LOGIN
//===========================================================================================================
export const loginUser = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const response = await axiosInstance.post("/users/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error);

    if (error.response) {
      const message = Array.isArray(error.response.data.message)
        ? error.response.data.message[0]
        : error.response.data.message || "Login failed";
      throw new Error(message);
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

//===========================================================================================================
// USER ACCOUNT
//===========================================================================================================
export const home = async () => {
  try {
    const response = await axiosInstance.get("/users/home");
    return response.data;
  } catch (error: any) {
    console.error("Home error:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message || "Failed to load home data"
    );
  }
};

//===========================================================================================================
// GET USER PROFILE
//===========================================================================================================
export const getUserProfile = async () => {
  const response = await axiosInstance.get("/profile");
  return response.data;
};

//===========================================================================================================
// UPDATE USER PROFILE
//===========================================================================================================
export const updateUserProfile = async (
  name: string,
  email: string,
  image: string
) => {
  try {
    if (!name || !email || !image) {
      throw new Error("All fields are required");
    }

    const response = await axiosInstance.put("/users/update-profile", {
      name,
      email,
      image,
    });

    return response.data;
  } catch (error: any) {
    console.error("Update profile error:", error.response?.data || error);

    if (error.response) {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message[0]
        : error.response.data.message || "Failed to update profile";
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw error;
    }
  }
};

//===========================================================================================================
// USER LOGOUT
//===========================================================================================================
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post("/users/logout");
    return response.data;
  } catch (error: any) {
    console.error("Logout error:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Failed to logout");
  }
};

