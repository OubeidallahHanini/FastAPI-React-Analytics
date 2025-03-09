import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Chart from "chart.js";

export default function CardBarChart() {
  const chartRef = useRef(null); // To save the canva i used useRef
  const chartInstance = useRef(null); // Save the instance of the Chart
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:9000/api/sales-by-platform")
      .then((response) => {
        const data = response.data;
        console.log("Données reçues :", data);

        // Extraction Platfroms and sales
        const platforms = data.map((entry) => entry.platform);
        const sales = data.map((entry) => entry.total_sales);

        setChartData({ platforms, sales });

        // Verif if the canva exists
        if (chartRef.current) {
          const ctx = chartRef.current.getContext("2d");

          // If a graphic exists then destroy it before the new creation
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }

          // Configuration of the Chart
          chartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
              labels: platforms,
              datasets: [
                {
                  label: "",
                  backgroundColor: ["#4c51bf", "#ed64a6", "#f6ad55", "#68d391"], 
                  borderColor: "#4c51bf",
                  data: sales,
                  fill: false,
                  barThickness: 30,
                },
              ],
            },
            options: {
              maintainAspectRatio: false,
              responsive: true,
              title: {
                display: false,
                text: "Sales by Platform",
              },
              tooltips: {
                mode: "index",
                intersect: false,
              },
              hover: {
                mode: "nearest",
                intersect: true,
              },
              legend: {
                labels: {
                  fontColor: "rgba(0,0,0,.4)",
                },
                align: "end",
                position: "bottom",
              },
              scales: {
                xAxes: [
                  {
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: "Platform",
                    },
                    gridLines: {
                      borderDash: [2],
                      borderDashOffset: [2],
                      color: "rgba(33, 37, 41, 0.3)",
                      zeroLineColor: "rgba(33, 37, 41, 0.3)",
                      zeroLineBorderDash: [2],
                      zeroLineBorderDashOffset: [2],
                    },
                  },
                ],
                yAxes: [
                  {
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: "Sales (€)",
                    },
                    gridLines: {
                      borderDash: [2],
                      drawBorder: false,
                      borderDashOffset: [2],
                      color: "rgba(33, 37, 41, 0.2)",
                      zeroLineColor: "rgba(33, 37, 41, 0.15)",
                      zeroLineBorderDash: [2],
                      zeroLineBorderDashOffset: [2],
                    },
                  },
                ],
              },
            },
          });
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données de ventes :", error);
      });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
              Performance
            </h6>
            <h2 className="text-blueGray-700 text-xl font-semibold">
              Sales by Platform (€)
            </h2>
          </div>
        </div>
      </div>
      <div className="p-4 flex-auto">
        {chartData ? (
          <div className="relative h-350-px">
            <canvas ref={chartRef}></canvas> {/* Here The strength of the refs in React instead of using just ID */}
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading data...</p>
        )}
      </div>
    </div>
  );
}
