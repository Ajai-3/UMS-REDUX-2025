import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactElement;
}

const UserProtectedRoute = ({ children }: Props) => {
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/users/login" replace />;
  }

  return <>{children}</>;
};

export default UserProtectedRoute;
