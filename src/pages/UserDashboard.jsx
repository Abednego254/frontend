import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user info
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "seller") {
        // if user is not a seller, redirect
        navigate("/dashboard");
      } else {
        setUser(parsedUser);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null; // wait until user loads

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Hello, {user.username}! 👋
        </h1>
        <p className="text-gray-600 mb-6">
          Role: <span className="font-semibold text-blue-600">{user.role}</span>
        </p>

        <div className="space-y-4">
          {/* Manage Items */}
          <button
            onClick={() => {
              console.log("Navigating to /manage-items...");
              navigate("/manage-items");
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-200"
          >
            Manage Items
          </button>

          {/* View Sales */}
          <button
            onClick={() => navigate("/view-sales")}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition duration-200"
          >
            View Sales
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
