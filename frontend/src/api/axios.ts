import axios from "axios";

// Create axios instance with credentials enabled to send cookies
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // This ensures cookies are sent with every request
});

// Add a response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.log("Authentication error: Not authenticated or session expired");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
