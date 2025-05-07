import axiosInstance from "../axios";

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
// CREATE USER
//===========================================================================================================
export const createUser = async (name: string, email: string, image: string, password: string) => {
  try {
    if (!name || !email || !image || !password) {
      throw new Error("All fields are required");
    }
    
    const response = await axiosInstance.post("/admin/create", {
      name,
      email,
      image,
      password
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating user:", error.response?.data || error.message);

    if (error.response) {
      const errorMessage = error.response.data.message || "Server error";
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw error;
    }
  }
}

//===========================================================================================================
// EDIT USER
//===========================================================================================================
export const editUser = async (id: string, name: string, email: string) => {
  try {
    // Validate inputs
    if (!id || !name || !email) {
      throw new Error("All fields are required");
    }
    
    const response = await axiosInstance.patch("/admin/edit", {
      id,
      name,
      email
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error editing user:", error.response?.data || error.message);

    if (error.response) {
      // The request was made and the server responded with an error
      const errorMessage = error.response.data.message || "Server error";
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response from server. Please check your connection.");
    } else {
      // Something happened in setting up the request
      throw error;
    }
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
