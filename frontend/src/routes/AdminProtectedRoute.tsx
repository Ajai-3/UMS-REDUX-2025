import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";

interface Props {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.admin.isAuthenticated
  );


  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
