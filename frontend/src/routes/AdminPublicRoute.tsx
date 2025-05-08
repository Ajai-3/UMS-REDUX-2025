import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";

interface Props {
  children: React.ReactNode;
}

const AdminPublicRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.admin.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminPublicRoute;
