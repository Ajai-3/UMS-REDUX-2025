import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import { registerUser, loginUser } from "../api/user/userService";
import { uploadImageToCloudinary } from "../utils/cloudinary";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [signState, setSignState] = useState<"Log In" | "Sign Up">("Log In");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      try {
        setLoading(true);
        const data = await loginUser(email, password);
        if (data.user) {
          toast.success("Login successful.");
          dispatch(setUser({
            user: data.user,
          }));
          navigate('/home');
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
      try {
        setLoading(true);
        
        // Validate inputs
        if (!name || !email || !password) {
          toast.error("All fields are required");
          setLoading(false);
          return;
        }
        
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
        
        if (!imageFile) {
          toast.error("Please upload an image");
          setLoading(false);
          return;
        }
        
        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
          toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
          setLoading(false);
          return;
        }

        // Upload image
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

        // Register user
        try {
          const data = await registerUser(name, email, imageUrl, password);
          if (data.user) {
            dispatch(setUser({
              user: data.user,
            }));
            toast.success("Account created successfully");
            navigate('/home');
          } else {
            toast.error("Registration failed");
          }
        } catch (registerErr: any) {
          console.error("Registration error:", registerErr);
          toast.error(registerErr?.response?.data?.message || "Registration failed");
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

  const inputStyle = "w-full bg-transparent border-b border-gray-600 p-2 focus:outline-none focus:border-blue-400";

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
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || imageUploading}
            />

            <input
              className={inputStyle}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || imageUploading}
            />

            {signState === "Sign Up" && (
              <input
                className={inputStyle}
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || imageUploading}
              />
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
