import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Reject fake or empty tokens
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
