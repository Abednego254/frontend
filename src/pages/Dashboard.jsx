import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // if no user found, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null; // don't render until we have user data

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Welcome, {user.username} 👋
        </h1>
        <p className="text-gray-600 mb-6">
          You are logged in as <span className="font-semibold">{user.role}</span>
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
