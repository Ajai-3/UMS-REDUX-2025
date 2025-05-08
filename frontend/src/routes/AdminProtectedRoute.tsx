import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<Props> = ({ children }) => {

  const isAdmin = localStorage.getItem("adminAuth") === "true";


  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }


  return <>{children}</>;
};

export default AdminProtectedRoute;
