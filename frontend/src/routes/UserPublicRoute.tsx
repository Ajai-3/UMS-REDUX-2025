import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactElement;
}

const UserPublicRoute = ({ children }: Props) => {

  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

  if (isLoggedIn) {

    return <Navigate to="/users/home" replace />;
  }

  return <>{children}</>;
};

export default UserPublicRoute;
