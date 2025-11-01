import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ManageItems() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "seller") {
      navigate("/dashboard");
    } else {
      setUser(parsedUser);
    }
  } else {
    navigate("/login");
  }
}, [navigate]);

  if (!user) return null;
  console.log("Currently at:", window.location.pathname);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Manage Items 🛒
        </h1>
        <p className="text-gray-600 mb-6">
          Logged in as <span className="font-semibold">{user.username}</span>
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/add-item")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-200"
          >
            ➕ Add New Item
          </button>

          <button
            onClick={() => navigate("/sell-item")}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition duration-200"
          >
            💰 Sell an Item
          </button>

          <button
            onClick={() => navigate("/user-dashboard")}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition duration-200"
          >
            🔙 Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageItems;
