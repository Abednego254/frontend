import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import api from "../api/axios"; // axios instance configured with baseURL and auth token
import { useNavigate } from "react-router-dom";

function AddItems() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle photo selection and preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemName || !price || !stock || !photo) {
      toast.error("Please fill all required fields and select a photo.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload the photo to backend
      const formData = new FormData();
      formData.append("photo", photo);

      const photoResponse = await api.post("/photo/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const photoPath = photoResponse.data.file_path; // saved path from backend

      // Step 2: Submit item data including photo path
      await api.post("/items/", {
        name: itemName,
        price,
        description,
        stock,
        photo: photoPath, // optional, just for frontend reference
      });

      setLoading(false);
      toast.success("Item added successfully! Redirecting...", { duration: 4000 });

      // Clear fields
      setItemName("");
      setPrice("");
      setDescription("");
      setStock("");
      setPhoto(null);
      setPhotoPreview(null);

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
              placeholder="Describe the item."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mb-6 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />

          <input
              type="number"
              placeholder="Number of items to add"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-2 mb-6 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
          />

          {/* Photo Upload */}
          <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full mb-4"
              required
          />
          {photoPreview && (
              <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover mb-6 rounded"
              />
          )}

          <button
              type="submit"
              disabled={loading}
              className={`w-full text-white p-2 rounded transition duration-200 ${
                  loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
  );
}

export default AddItems;
