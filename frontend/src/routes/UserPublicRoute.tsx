import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";

interface Props {
  children: React.ReactElement;
}

const UserPublicRoute = ({ children }: Props) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/users/home" replace />;
  }


  return <>{children}</>;
};

export default UserPublicRoute;
