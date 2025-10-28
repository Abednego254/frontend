import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Redirect if not admin
      if (parsedUser.role !== "admin") {
        toast.error("Access denied! Only admins can access this dashboard.", {
          duration: 5000,
        });
        navigate("/user-dashboard");
      } else {
        setAdmin(parsedUser);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("You’ve been logged out successfully!", { duration: 4000 });
    setTimeout(() => navigate("/login"), 2000);
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold mb-3 text-gray-800">
          Welcome, {admin.username}! 🛠️
        </h1>
        <p className="text-gray-600 mb-6">
          This is your <strong>Admin Dashboard</strong>. You can manage users, view transactions, and approve accounts.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => toast("Manage Users feature coming soon!", { icon: "👥" })}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded transition"
          >
            Manage Users
          </button>

          <button
            onClick={() => toast("View Reports feature coming soon!", { icon: "📊" })}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
          >
            View Reports
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
