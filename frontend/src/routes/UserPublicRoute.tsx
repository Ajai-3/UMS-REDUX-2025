import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";

interface Props {
  children: React.ReactElement;
}

const UserPublicRoute = ({ children }: Props) => {
  const user = useSelector((state: RootState) => state.user.user);

  if (user) {
    return <Navigate to="/users/home" />;
  }

  return children;
};

export default UserPublicRoute;
