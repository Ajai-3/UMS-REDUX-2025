import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAdmin } from "../redux/slices/adminSlice";
import { loginAdmin, dashboard } from "../api/admin/adminService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RootState } from "../redux/store";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state: RootState) => state.admin.isAuthenticated
  );
  const adminData = useSelector((state: RootState) => state.admin.admin);

  useEffect(() => {
    if (isAuthenticated && adminData) {
      navigate("/admin/dashboard");
      return;
    }

    const hasAdminCookies =
      document.cookie.includes("adminAccessToken") ||
      document.cookie.includes("adminRefreshToken");

    if (hasAdminCookies) {
      const verifyAdminAuth = async () => {
        try {
          const data = await dashboard("");
          if (data) {
            dispatch(
              setAdmin({
                admin: data.admin,
                isAuthenticated: true,
              })
            );
            navigate("/admin/dashboard");
          }
        } catch (error) {
          console.error("Failed to verify admin authentication:", error);
        }
      };

      verifyAdminAuth();
    }
  }, [dispatch, navigate, isAuthenticated, adminData]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    } else if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const data = await loginAdmin(email, password);

      if (data) {
        dispatch(
          setAdmin({
            admin: data.admin,
          })
        );

        localStorage.setItem("adminLoggedIn", "true");

        toast.success("Admin login successful");
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form onSubmit={handleAdminLogin}>
        <div className="flex flex-col gap-4 p-10 w-96 bg-zinc-900 rounded-md">
          <h1 className="text-center text-2xl">Admin Login</h1>
          <input
            className="bg-transparent outline-none border border-gray-600 focus:border-pink-700 p-2 rounded-md"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <div className="relative">
            <input
              className="bg-transparent outline-none border border-gray-600 focus:border-pink-700 p-2 rounded-md w-full"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-950 hover:bg-pink-900 p-2 rounded-md flex justify-center items-center"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
