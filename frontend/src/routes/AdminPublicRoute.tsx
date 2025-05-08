import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const AdminPublicRoute: React.FC<Props> = ({ children }) => {
  const isAdmin = localStorage.getItem("adminAuth") === "true";

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminPublicRoute;
