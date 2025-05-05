import React, { useState } from "react";
import { loginAdmin } from "../api/admin/adminService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        if(!password) {
            toast.error("Password is required")
            return;
        } else if ((password.length) < 8) {
            toast.error("Invalid Email or Password")
            return;
        }
        const data = await loginAdmin(email, password)

        if (data) {
            toast.success("Admin loggined successfull")
        navigate("/admin/dashboard") 
        }
    } catch (error: any) {
        toast.error(error)
    } 
     
  } 

  return (
    <div className="flex h-screen justify-center items-center">
      <form onSubmit={handleAdminLogin}>
      <div className="flex flex-col gap-4 p-10 w-96 bg-zinc-900 rounded-md">
        <h1 className="text-center text-2xl">Admin Login</h1>
        <input
          className="bg-transparent outline-none border border-gray-600 focus:border-pink-700 p-2 rounded-md"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <input
          className="bg-transparent outline-none border border-gray-600 focus:border-pink-700 p-2 rounded-md"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
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
