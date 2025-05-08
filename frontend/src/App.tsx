import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminPublicRoute from "./routes/AdminPublicRoute";
import UserProtectedRoute from "./routes/UserProtectedRoute";
import UserPublicRoute from "./routes/UserPublicRoute";

const App: React.FC = () => {
  return (
    <>
      <ToastContainer theme="dark" />
      <Routes>
        <Route
          path="/users/home"
          element={
            <UserProtectedRoute>
              <Home />
            </UserProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/users/login" />} />
        <Route
          path="/users/login"
          element={
            <UserPublicRoute>
              <Login />
            </UserPublicRoute>
          }
        />
        <Route
          path="/admin/login"
          element={
            <AdminPublicRoute>
              <AdminLogin />
            </AdminPublicRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
