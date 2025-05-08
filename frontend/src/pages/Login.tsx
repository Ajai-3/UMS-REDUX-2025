import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import { registerUser, loginUser, home } from "../api/user/userService";
import { uploadImageToCloudinary } from "../utils/cloudinary";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login: React.FC = () => {
  const [signState, setSignState] = useState<"Log In" | "Sign Up">("Log In");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if user is already logged in when component mounts
  useEffect(() => {
    // Check for auth cookies
    const hasCookies =
      document.cookie.includes("accessToken") ||
      document.cookie.includes("refreshToken");

    if (hasCookies) {
      // If they have auth cookies, try to get their profile
      const fetchUserProfile = async () => {
        try {
          const data = await home();
          if (data) {
            // If successful, update Redux and redirect
            dispatch(
              setUser({
                user: data,
                isAuthenticated: true,
              })
            );
            navigate("/users/home");
          }
        } catch (error) {
          // If error, cookies might be invalid
          console.error("Failed to verify authentication:", error);
        }
      };

      fetchUserProfile();
    }
  }, [dispatch, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signState === "Log In") {
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
      }

      try {
        setLoading(true);
        const data = await loginUser(email, password);
        if (data.user) {
          toast.success("Login successful.");
          console.log(data);
          // Store user data in Redux
          dispatch(
            setUser({
              user: data.user,
              isAuthenticated: true,
            })
          );

          // Set localStorage flag for authentication
          localStorage.setItem("userLoggedIn", "true");

          navigate("/users/home");
        } else {
          toast.error("Login failed");
        }
      } catch (error: any) {
        console.error("Login Error:", error);
        toast.error(error?.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    }

    if (signState === "Sign Up") {
      if (!name.trim()) {
        toast.error("Name is required");
        return;
      }

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
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (!imageFile) {
        toast.error("Please upload an image");
        return;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        toast.error(
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        );
        return;
      }

      try {
        setLoading(true);

        setImageUploading(true);
        let imageUrl;
        try {
          imageUrl = await uploadImageToCloudinary(imageFile);
          setImage(imageUrl);
          setImageUploading(false);
        } catch (uploadErr: any) {
          console.error("Image upload error:", uploadErr);
          toast.error("Image upload failed: " + uploadErr.message);
          setLoading(false);
          setImageUploading(false);
          return;
        }

        try {
          const data = await registerUser(name, email, imageUrl, password);
          if (data.user) {
            // Store user data in Redux
            dispatch(
              setUser({
                user: data.user,
                isAuthenticated: true,
              })
            );

            // Set localStorage flag for authentication
            localStorage.setItem("userLoggedIn", "true");

            toast.success("Account created successfully");
            navigate("/users/home");
          } else {
            toast.error("Registration failed");
          }
        } catch (registerErr: any) {
          console.error("Registration error:", registerErr);
          toast.error(
            registerErr?.response?.data?.message || "Registration failed"
          );
        }
      } catch (error: any) {
        console.error("Signup Error:", error);
        toast.error(error?.message || "Signup failed");
      } finally {
        setLoading(false);
        setImageUploading(false);
      }
    }
  };

  const inputStyle =
    "w-full bg-transparent border-b border-gray-600 p-2 focus:outline-none focus:border-blue-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 to-black">
      <div className="bg-black bg-opacity-30 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          {signState === "Log In" ? "Welcome Back" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {signState === "Sign Up" && (
              <>
                <div className="flex justify-center relative w-full">
                  {imageUploading ? (
                    <div className="w-20 h-20 rounded-full border border-gray-600 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={imagePreview || "/default-avatar.png"}
                        alt="preview"
                        className="w-20 h-20 rounded-full object-cover border border-gray-600"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute w-20 h-20 opacity-0 cursor-pointer"
                        disabled={loading || imageUploading}
                      />
                    </>
                  )}
                </div>
                <input
                  className={inputStyle}
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading || imageUploading}
                />
              </>
            )}

            <input
              className={inputStyle}
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || imageUploading}
            />

            <div className="relative">
              <input
                className={inputStyle}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || imageUploading}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            {signState === "Sign Up" && (
              <div className="relative">
                <input
                  className={inputStyle}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || imageUploading}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-950 hover:bg-blue-900 p-2 rounded-md flex justify-center items-center"
              disabled={loading || imageUploading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                signState
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-white">
          {signState === "Log In"
            ? "Don't have an Account?"
            : "Already have an Account?"}{" "}
          <button
            type="button"
            className="text-blue-400 underline"
            onClick={() =>
              setSignState(signState === "Log In" ? "Sign Up" : "Log In")
            }
            disabled={loading || imageUploading}
          >
            {signState === "Log In" ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
