import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";

interface Props {
  children: React.ReactElement;
}

const UserProtectedRoute = ({ children }: Props) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated); 

  if (!isAuthenticated) {
    return <Navigate to="/users/login" />;
  }

  return <>{children}</>;
};

export default UserProtectedRoute;
