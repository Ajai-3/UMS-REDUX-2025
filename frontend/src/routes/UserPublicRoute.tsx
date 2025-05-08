import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactElement;
}

const UserPublicRoute = ({ children }: Props) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is logged in using localStorage
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

    if (isLoggedIn) {
      // If logged in, redirect to home page
      navigate("/users/home", { replace: true });
      setIsAuthenticated(true);
    }

    setCheckingAuth(false);
  }, [navigate]);

  // Show nothing while checking authentication
  if (checkingAuth || isAuthenticated) {
    return null;
  }

  // If not authenticated, show the login page
  return <>{children}</>;
};

export default UserPublicRoute;
