import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast, Toaster } from "react-hot-toast";

function ViewSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [totalSales, setTotalSales] = useState(0);

  // ✅ Load user ID from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUserId(user.id);
  }, []);

  // ✅ Fetch sales for this seller
  useEffect(() => {
    const fetchSales = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const response = await api.get(`/sales/${userId}`);
        const data = response.data || [];
        setSales(data);

        // ✅ Calculate total sales
        const total = data.reduce(
            (sum, sale) => sum + (sale.total_price || 0),
            0
        );
        setTotalSales(total);
      } catch (err) {
        console.error("Error fetching sales:", err.response);
        const msg =
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to fetch sales.";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [userId]);

  return (
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <Toaster position="top-right" />
        <h1 className="text-3xl font-bold text-center mb-8">Your Sales</h1>

        {loading ? (
            <p className="text-center text-gray-500">Loading your sales...</p>
        ) : sales.length === 0 ? (
            <p className="text-center text-gray-600">No sales available yet.</p>
        ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 text-left">Item</th>
                  <th className="py-2 px-3 text-center">Quantity</th>
                  <th className="py-2 px-3 text-center">Price (KSh)</th>
                  <th className="py-2 px-3 text-center">Total</th>
                  <th className="py-2 px-3 text-center">Date Sold</th>
                </tr>
                </thead>
                <tbody>
                {sales.map((sale) => (
                    <tr
                        key={sale.invoice_id}
                        className="border-t hover:bg-gray-50"
                    >
                      <td className="py-2 px-3 flex items-center gap-2">
                        {sale.photo_url && (
                            <img
                                src={sale.photo_url.startsWith("http")
                                    ? sale.photo_url
                                    : `http://127.0.0.1:5000${sale.photo_url}`}
                                alt={sale.item_name}
                                className="w-10 h-10 object-cover rounded"
                            />
                        )}
                        {sale.item_name}
                      </td>
                      <td className="py-2 px-3 text-center">{sale.quantity}</td>
                      <td className="py-2 px-3 text-center">
                        {sale.price.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-center font-semibold">
                        {sale.total_price.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-center">{sale.date_sold}</td>
                    </tr>
                ))}
                </tbody>
              </table>

              {/* ✅ Total Sales Summary */}
              <div className="p-4 text-right border-t bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Sales:{" "}
                  <span className="text-green-600">
                Ksh {totalSales.toLocaleString()}
              </span>
                </h3>
              </div>
            </div>
        )}
      </div>
  );
}

export default ViewSales;
