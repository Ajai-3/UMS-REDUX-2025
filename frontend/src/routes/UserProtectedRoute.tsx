import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";

interface Props {
  children: React.ReactElement;
}

const UserProtectedRoute = ({ children }: Props) => {
  const user = useSelector((state: RootState) => state.user.user); 

  if (!user) {
    return <Navigate to="/users/login" />;
  }

  return children; 
};

export default UserProtectedRoute;
