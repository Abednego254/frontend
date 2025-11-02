import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast, Toaster } from "react-hot-toast";

function ViewItems() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get("/items/");
                setItems(response.data || []);
            } catch (err) {
                console.error("Error getting items.", err.response);
                const errorMessage =
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    "Failed to fetch items.";
                toast.error(errorMessage, { duration: 5000 });
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <Toaster position="top-right" reverseOrder={false} />
            <h1 className="text-3xl font-bold text-center mb-8">All Items</h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <svg
                        className="animate-spin h-10 w-10 text-blue-500"
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
                </div>
            ) : items.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">
                    No items available at the moment.
                </p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <img
                                src={
                                    item.photo
                                        ? `http://localhost:5000${item.photo}`
                                        : "https://via.placeholder.com/300x200.png?text=No+Image"
                                }
                                alt={item.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {item.description || "No description provided."}
                                </p>
                                <p className="text-blue-600 font-bold mb-1">
                                    KSh {item.price.toLocaleString()}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Stock: <span className="font-medium">{item.stock || 0}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ViewItems;
