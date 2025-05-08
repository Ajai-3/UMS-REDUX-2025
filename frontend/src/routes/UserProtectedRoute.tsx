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
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

    if (!isLoggedIn) {

      navigate("/users/login", { replace: true });
    } else {
      setIsAuthenticated(true);
    }

    setCheckingAuth(false);
  }, [navigate]);


  if (checkingAuth) {
    return null;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default UserProtectedRoute;
