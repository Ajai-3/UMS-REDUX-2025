import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactElement;
}

const UserProtectedRoute = ({ children }: Props) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is logged in using localStorage
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

    if (!isLoggedIn) {
      // If not logged in, redirect to login page
      navigate("/users/login", { replace: true });
    } else {
      setIsAuthenticated(true);
    }

    setCheckingAuth(false);
  }, [navigate]);

  // Show nothing while checking authentication
  if (checkingAuth) {
    return null;
  }

  // If authenticated, show the protected content
  return isAuthenticated ? <>{children}</> : null;
};

export default UserProtectedRoute;
