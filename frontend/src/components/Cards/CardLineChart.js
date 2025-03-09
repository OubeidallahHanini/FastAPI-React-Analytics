import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js";
import axios from "axios";

export default function CardLineChart() {
  const [chartData, setChartData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("total_sales");

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/metricsOverMonth")
      .then((response) => setChartData(response.data))
      .catch((error) => console.error("Erreur API:", error));
  }, []);

  useEffect(() => {
    if (!chartData.length) return;

    const labels = chartData.map((item) => item.month);
    const data = chartData.map((item) => Number(item[selectedMetric]));

    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.labels = labels;
      chartInstanceRef.current.data.datasets[0].data = data;
      chartInstanceRef.current.data.datasets[0].label = selectedMetric;
      chartInstanceRef.current.options.scales.yAxes[0].scaleLabel.labelString = selectedMetric;
      chartInstanceRef.current.update();
      return;
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: selectedMetric,
            backgroundColor: "#4c51bf",
            borderColor: "#4c51bf",
            data,
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false,  
        },
        scales: {
          xAxes: [{
            scaleLabel: { display: true, labelString: "Month" },
          }],
          yAxes: [{
            scaleLabel: { display: true, labelString: selectedMetric },
          }],
        },
      },
    });
  }, [chartData, selectedMetric]);

  const numericMetrics = chartData[0]
    ? Object.keys(chartData[0]).filter((key) => key !== "month" && key !== "top_product")
    : [];

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <div className="rounded-t mb-0 px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h6 className="uppercase text-gray-500 mb-1 text-xs font-semibold">Overview</h6>
              <h2 className="text-gray-800 text-xl font-semibold">Metrics by Month</h2>
            </div>
            <select
              className="border border-gray-300 rounded px-3 py-1"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              {numericMetrics.map((metric) => (
                <option key={metric} value={metric}>
                  {metric.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-4 flex-auto">
          <div className="relative h-350-px">
            <canvas ref={chartRef} />
          </div>
        </div>
      </div>
    </>
  );
}