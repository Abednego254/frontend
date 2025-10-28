import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import api from "../api/axios"; // uses the configured axios instance

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Login request using the configured api instance
      const response = await api.post("/auth/login", formData);
      const { access_token: token, user } = response.data;

      // Store token & user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setLoading(false);
      toast.success("Login successful! Redirecting...", { duration: 7000 });

      // Redirect based on user role
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }, 7000);
    } catch (err) {
      setLoading(false);
      console.error("Login error response:", err.response);
      const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong. Please try again.";
      toast.error(errorMessage, { duration: 7000 });
    }
  };

  return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Toaster position="top-right" reverseOrder={false} />

        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
          />

          <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mb-6 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
          />

          <button
              type="submit"
              disabled={loading}
              className={`w-full text-white p-2 rounded transition duration-200 ${
                  loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {loading ? (
                <div className="flex justify-center items-center">
                  <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                  >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Logging in...
                </div>
            ) : (
                "Login"
            )}
          </button>

          <p className="text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <span
                onClick={() => navigate("/register")}
                className="text-blue-500 hover:underline cursor-pointer"
            >
            Register
          </span>
          </p>
        </form>
      </div>
  );
}

export default Login;
