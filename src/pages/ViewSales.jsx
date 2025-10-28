import React from "react";
import { useNavigate } from "react-router-dom";

function ViewSales() {
  const navigate = useNavigate();

  // Temporary static data
  const salesData = [
    {
      id: 1,
      itemName: "Fresh Tilapia",
      quantity: 10,
      totalPrice: 3500,
      dateSold: "2025-10-20",
    },
    {
      id: 2,
      itemName: "Catfish",
      quantity: 5,
      totalPrice: 1800,
      dateSold: "2025-10-22",
    },
    {
      id: 3,
      itemName: "Fish Feed",
      quantity: 20,
      totalPrice: 6000,
      dateSold: "2025-10-25",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Sales</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
          >
            Back
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">Item Name</th>
                <th className="py-2 px-4 border">Quantity Sold</th>
                <th className="py-2 px-4 border">Total Price (Ksh)</th>
                <th className="py-2 px-4 border">Date Sold</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale) => (
                <tr key={sale.id} className="text-center hover:bg-gray-50">
                  <td className="py-2 px-4 border">{sale.itemName}</td>
                  <td className="py-2 px-4 border">{sale.quantity}</td>
                  <td className="py-2 px-4 border">{sale.totalPrice}</td>
                  <td className="py-2 px-4 border">{sale.dateSold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewSales;
