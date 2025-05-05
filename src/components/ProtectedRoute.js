// src/components/ProtectedRoute.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkTokenExpiry } from "../utils/auth"; // Token check karne ka function import karo

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isTokenValid = checkTokenExpiry();

    if (!isTokenValid) {
      // Token expired, localStorage se token remove karo aur login page pe redirect karo
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return isTokenValid ? children : null; // Token valid hone par children component render karo
};

export default ProtectedRoute;
