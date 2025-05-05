import React, { useState } from "react";
import { toast } from "react-toastify";
import { registerUser, loginUser } from "../api/user/userService";
import { uploadImageToCloudinary } from "../utils/cloudinary";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [signState, setSignState] = useState("Log In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const navigate = useNavigate()

  const inputStyle =
    "bg-transparent outline-none border border-gray-600 focus:border-blue-700 p-2 rounded-md";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signState === "Log In") {
      try {
        setLoading(true);
        const data = await loginUser(email, password);
        console.log(data);
        if (data.user) {
          toast.success("Login successfull.");
          navigate('/home')
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
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        if (!imageFile) {
          toast.error("Please upload an image.");
          return;
        }

        const url = await uploadImageToCloudinary(imageFile);
        setImage(url);
        const data = await registerUser(name, email, image, password);
        if(data.user) {
          toast.success("Account created successfully");
          navigate('/home')
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Signup failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setImageUploading(true);
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } catch (error) {
        toast.error("Error processing image");
      } finally {
        setImageUploading(false);
      }
    }
  };

  return (
    <div className="flex h-screen justify-center items-center flex-col">
      <div className="flex flex-col gap-4 w-96 bg-zinc-900 border border-gray-700 p-6 rounded-md">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl text-center">{signState}</h1>

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
                        disabled={imageUploading}
                      />
                    </>
                  )}
                </div>
                <input
                  className={inputStyle}
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading || imageUploading}
                />
              </>
            )}

            <input
              className={inputStyle}
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || imageUploading}
            />
            <input
              className={inputStyle}
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || imageUploading}
            />

            {signState === "Sign Up" && (
              <input
                className={inputStyle}
                type="password"
                placeholder="confirm password"
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