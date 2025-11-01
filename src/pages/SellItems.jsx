import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast, Toaster } from "react-hot-toast";
import { io } from "socket.io-client";

function SellItems() {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [clientPhone, setClientPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);

    // Fetch available items and logged-in user
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get("/items/");
                setItems(response.data || []);
            } catch (err) {
                console.error("Error fetching items:", err.response);
                const message =
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    "Failed to fetch available items.";
                toast.error(message);
            }
        };

        const user = JSON.parse(localStorage.getItem("user"));
        if (user) setUserId(user.id);
        fetchItems();
    }, []);

    // Add item to sale list
    const handleAddItem = (item) => {
        const existing = selectedItems.find((i) => i.id === item.id);
        if (existing) {
            setSelectedItems((prev) =>
                prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                )
            );
        } else {
            setSelectedItems((prev) => [...prev, { ...item, quantity: 1 }]);
        }
    };

    // Remove or reduce quantity
    const handleRemoveItem = (itemId) => {
        setSelectedItems((prev) =>
            prev
                .map((i) =>
                    i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
                )
                .filter((i) => i.quantity > 0)
        );
    };

    // Calculate total
    const total = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Request payment
    const handleRequestPayment = async () => {
        if (selectedItems.length === 0) {
            toast.error("Please select at least one item before requesting payment.");
            return;
        }

        if (!clientPhone.trim()) {
            toast.error("Please enter the client's phone number (e.g. 2547XXXXXXXX).");
            return;
        }

        if (!userId) {
            toast.error("User session expired. Please log in again.");
            return;
        }

        try {
            setLoading(true);

            // Step 1: Create Invoice
            const invoiceResponse = await api.post("/invoices/", {
                user_id: userId,
                items: selectedItems.map((item) => ({
                    item_id: item.id,
                    quantity: item.quantity,
                })),
            });

            const invoiceId = invoiceResponse.data.id;

            // Step 2: Trigger STK Push
            const mpesaResponse = await api.post("/mpesa/stkpush", {
                invoice_id: invoiceId,
                phone_number: clientPhone,
            });

            const { CustomerMessage } = mpesaResponse.data;

            toast.success(
                CustomerMessage ||
                "Payment request sent! Ask the client to check their phone."
            );

            // Optional: Poll the backend after some delay to check payment status
            setTimeout(async () => {
                try {
                    const checkResponse = await api.get(`/invoices/${invoiceId}`);
                    const status = checkResponse.data.status;

                    if (status === "paid") {
                        toast.success("✅ Payment successful! Invoice marked as paid.");
                    } else if (status === "cancelled") {
                        toast.error("❌ Payment cancelled by client.");
                    } else if (status === "failed" || status === "insufficient_funds") {
                        toast.error("⚠️ Payment failed due to insufficient funds.");
                    } else {
                        toast("⌛ Waiting for client to complete payment...", {
                            icon: "⏳",
                        });
                    }
                } catch (error) {
                    console.error("Error checking payment status:", error);
                    toast.error("Unable to verify payment status. Try again later.");
                }
            }, 10000); // Check after 10 seconds

            setSelectedItems([]);
            setClientPhone("");
        } catch (err) {
            console.error("Payment request error:", err.response);
            const msg =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Failed to process payment request.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <Toaster position="top-right" reverseOrder={false} />

            <h1 className="text-3xl font-bold text-center mb-8">
                Sell Items to Client
            </h1>

            {/* Items List */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Available Items</h2>

                {items.length === 0 ? (
                    <p className="text-gray-600 text-center">
                        No items available for sale at the moment.
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
                                        item.imageUrl ||
                                        "https://via.placeholder.com/300x200.png?text=No+Image"
                                    }
                                    alt={item.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                        {item.description || "No description provided."}
                                    </p>
                                    <p className="text-blue-600 font-bold mb-1">
                                        KSh {item.price.toLocaleString()}
                                    </p>
                                    <p className="text-gray-500 text-sm mb-3">
                                        Stock: {item.stock}
                                    </p>
                                    <button
                                        onClick={() => handleAddItem(item)}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Add to Sale
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">Selected Items</h2>
                    <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-3 text-left">Name</th>
                            <th className="py-2 px-3 text-center">Qty</th>
                            <th className="py-2 px-3 text-center">Price</th>
                            <th className="py-2 px-3 text-center">Total</th>
                            <th className="py-2 px-3 text-center">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedItems.map((item) => (
                            <tr key={item.id} className="border-t">
                                <td className="py-2 px-3">{item.name}</td>
                                <td className="py-2 px-3 text-center">{item.quantity}</td>
                                <td className="py-2 px-3 text-center">
                                    KSh {item.price.toLocaleString()}
                                </td>
                                <td className="py-2 px-3 text-center">
                                    KSh {(item.price * item.quantity).toLocaleString()}
                                </td>
                                <td className="py-2 px-3 text-center">
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="mt-4 text-right text-lg font-bold text-gray-700">
                        Total: KSh {total.toLocaleString()}
                    </div>
                </div>
            )}

            {/* Payment Section */}
            {selectedItems.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Client Payment</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <input
                            type="text"
                            placeholder="Client phone number (e.g. 2547XXXXXXXX)"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleRequestPayment}
                            disabled={loading}
                            className={`${
                                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                            } text-white px-6 py-2 rounded-lg transition-colors`}
                        >
                            {loading ? "Processing..." : "Request Payment"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellItems;
