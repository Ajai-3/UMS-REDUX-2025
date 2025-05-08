import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";

interface Props {
  children: React.ReactElement;
}

const UserProtectedRoute = ({ children }: Props) => {
  const user = useSelector((state: RootState) => state.user.user);
  return user ? children : <Navigate to="/users/login" />;
};

export default UserProtectedRoute;
