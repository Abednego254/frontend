import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import api from '../api/axios';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

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
      const response = await api.post('/auth/register', formData);
      setLoading(false);

      const message =
        response.data.message ||
        'Registration successful! Please check your email and await admin approval.';

      // ✅ Show success toast (visible for 7 seconds)
      toast.success(message, { duration: 7000 });

      // Redirect after 7 seconds
      setTimeout(() => {
        navigate('/login');
      }, 7000);
    } catch (err) {
      setLoading(false);
      console.error('Register error full response:', err.response);
      const serverErr =
        err.response?.data?.error || err.response?.data?.message || 'Something went wrong';
      toast.error(serverErr, { duration: 7000 });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Full Name"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />

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
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
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
              Registering...
            </div>
          ) : (
            'Register'
          )}
        </button>
      </form>
    </div>
  );
}

export default Register;
