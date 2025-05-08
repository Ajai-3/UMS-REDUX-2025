import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const AdminPublicRoute: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if admin is logged in using localStorage
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

    if (isAdminLoggedIn) {
      // If logged in, redirect to dashboard
      navigate("/admin/dashboard", { replace: true });
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

export default AdminPublicRoute;
