import { loginAdmin } from './adminService';
import axiosInstance from "../axios";
import { Try } from '@mui/icons-material';

//===========================================================================================================
// ADMIN LOGIN
//===========================================================================================================
export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/admin/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Something went wrong";
  }
};

//===========================================================================================================
// ADMIN DASHBOARD
//===========================================================================================================
export const dashboard = async (search: string) => {
    try {
       const response = await axiosInstance.get("/admin/dashboard", {
        params: { search },
      }) 
       return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Something went wrong";
    }
}

//===========================================================================================================
// DELETE USER
//===========================================================================================================
export const deleteUser = async (id: string) => {
    try {
        const response = await axiosInstance.delete("/admin/delete", { data: {id} },)
        return response.data
    } catch (error: any) {
        throw error.response?.data?.message || "Something went wrong";
    }
}

//===========================================================================================================
// ADMIN LOGOUT
//===========================================================================================================
export const logoutAdmin = async () => {
    try {
        const response = await axiosInstance.post("/admin/logout")
        return response.data
    } catch (error: any) {
        throw error.response?.data?.message || "Something went wrong";
    }
}