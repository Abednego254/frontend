import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import api from "../api/axios"; // uses the configured axios instance
import { useNavigate } from "react-router-dom";

function AddItems() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemName || !price || !stock) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    try {
      // POST request — token handled automatically by axios.js
      const response = await api.post("/items/", {
        name: itemName,
        price,
        description,
        stock,
      });

      setLoading(false);
      toast.success("Item added successfully! Redirecting ....", { duration: 5000 });

      // Clear fields
      setItemName("");
      setPrice("");
      setDescription("");
      setStock("");

      // Optional redirect after 2 sec
      setTimeout(() => navigate("/view-item"), 2000);
    } catch (err) {
      setLoading(false);
      console.error("Add item error:", err.response);
      const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to add item.";
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Toaster position="top-right" reverseOrder={false} />
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Add Item</h2>

          <input
              type="text"
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
          />

          <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 mb-6 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
          />

          <textarea
              type="text"
              placeholder="Describr the item."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mb-6 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
          />

          <input
              type="number"
              placeholder="Number of the items to add."
              value={stock}
              onChange={(e) => setStock(e.target.value)}
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
                  Adding...
                </div>
            ) : (
                "Add Item"
            )}
          </button>
        </form>
      </div>
  );
}

export default AddItems;
