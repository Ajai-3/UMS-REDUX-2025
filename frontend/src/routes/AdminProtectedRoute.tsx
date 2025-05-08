import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if admin is logged in using localStorage
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

    if (!isAdminLoggedIn) {
      // If not logged in, redirect to login page
      navigate("/admin/login", { replace: true });
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

export default AdminProtectedRoute;
