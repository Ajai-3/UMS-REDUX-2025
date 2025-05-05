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
  const response = await axiosInstance.post("/users/register", {
    name,
    email,
    image,
    password,
  });
  return response.data;
};

//===========================================================================================================
// USER LOGIN
//===========================================================================================================
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/users/login", { email, password });
    return response.data;
  } catch (error: any) {
    if (error.response) {
        const message = Array.isArray(error.response.data.message)
          ? error.response.data.message[0]
          : error.response.data.message;
        return message; 
      }
      return "An unexpected error occurred"; 
    }
};

//===========================================================================================================
// USER ACOUNT
//===========================================================================================================
export const home = async () => {
  try {
    const response = await axiosInstance.get("/users/home")
    return response.data
  } catch (error) {
    
  }
}
//===========================================================================================================
// USER LOGOUT
//===========================================================================================================
export const logoutUser = async () => {
  const response = await axiosInstance.post("/users/logout");
  return response.data;
};

//===========================================================================================================
// GET USER PROFILE
//===========================================================================================================
export const getUserProfile = async () => {
  const response = await axiosInstance.get("/profile");
  return response.data;
};
