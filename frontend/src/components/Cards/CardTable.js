import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

export default function CardTable() {
  const [salesData, setSalesData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [platform, setPlatform] = useState("");
  
  const fetchSalesData = async () => {
    try {
      let queryParams = [];
      if (startDate) queryParams.push(`start_date=${startDate}`);
      if (endDate) queryParams.push(`end_date=${endDate}`);
      if (platform) queryParams.push(`platform=${platform}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
      const response = await axios.get(`http://localhost:9000/api/sales${queryString}`);
      setSalesData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des ventes :", error);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white p-6">
      {/* Filtres */}
      <div className="flex items-center space-x-4 mb-4 w-full overflow-x-auto">
      <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
  />
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"

  />
  <select
    value={platform}
    onChange={(e) => setPlatform(e.target.value)}
    className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
  >
    <option value="">All Platforms</option>
    <option value="Amazon">Amazon</option>
    <option value="eBay">eBay</option>
    <option value="Shopify">Shopify</option>
  </select>

  <button
    onClick={fetchSalesData}
    className="p-2 bg-blue-500 text-black rounded shadow hover:bg-blue-600 transition w-full sm:w-auto"
  >
    Apply filtres
  </button>
</div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse border border-gray-200">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border px-6 py-3">ID</th>
              <th className="border px-6 py-3">Date</th>
              <th className="border px-6 py-3">Product</th>
              <th className="border px-6 py-3">country</th>
              <th className="border px-6 py-3">Sales (€)</th>
              <th className="border px-6 py-3">Plateform</th>
            </tr>
          </thead>
          <tbody>
            {salesData.length > 0 ? (
              salesData.map((sale, index) => (
                <tr
                  key={sale.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="border px-6 py-3 text-center">{sale.id}</td>
                  <td className="border px-6 py-3 text-center">
                    {format(new Date(sale.order_date), "dd MMM yyyy", )}
                  </td>
                  <td className="border px-6 py-3 text-center">{sale.product_id}</td>
                  <td className="border px-6 py-3 text-center">{sale.country}</td>
                  <td className="border px-6 py-3 text-center font-bold text-blue-600">
                    {parseFloat(sale.gross_sales).toFixed(2)} €
                  </td>
                  <td className="border px-6 py-3 text-center">{sale.platform}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-600">
                  Any result found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
