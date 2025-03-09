import React, { useEffect, useState } from "react";
import axios from "axios";

// components
import CardStats from "components/Cards/CardStats.js";

export default function HeaderStats({ refreshTrigger }) { // Recieve Refresh trigger
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/advanced-key-metrics", { withCredentials: true })
      .then((response) => {
        setMetrics(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des métriques:", error);
        setLoading(false);
      });
  }, [refreshTrigger]); 

  if (loading) {
    return <div className="text-white text-center p-4">Chargement des métriques...</div>;
  }

  // Init variables and managing the data efficiently when no data provided
  const totalSales = metrics?.total_sales ? metrics.total_sales.toLocaleString() : "0";
  const avgOrderValue = metrics?.average_order_value ? metrics.average_order_value.toFixed(2) : "0.00";
  const totalUnitsSold = metrics?.total_units_sold ? metrics.total_units_sold.toLocaleString() : "0";
  const monthlySalesGrowth = metrics?.monthly_sales_growth_pct || 0;
  const topCountry = metrics?.top_country_by_sales || "N/A";
  const topSellingPlatform = metrics?.top_selling_platform || "N/A";
  const topSellingProduct = metrics?.top_selling_product || "N/A";
  const numCountries = metrics?.number_of_countries_sold_to || 0;

  return (
    <>
      {/* Header */}
      <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="TOTAL SALES"
                  statTitle={`${totalSales} €`}
                  statArrow={monthlySalesGrowth >= 0 ? "up" : "down"}
                  statPercent={Math.abs(monthlySalesGrowth)}
                  statPercentColor={monthlySalesGrowth >= 0 ? "text-emerald-500" : "text-red-500"}
                  statDescripiron="Since last month"
                  statIconName="fas fa-dollar-sign"
                  statIconColor="bg-green-500"
                />
              </div>

              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="AVG ORDER VALUE"
                  statTitle={`${avgOrderValue} €`}
                  statArrow="up"
                  statPercent="Stable"
                  statPercentColor="text-blueGray-500"
                  statDescripiron="Across all sales"
                  statIconName="fas fa-receipt"
                  statIconColor="bg-orange-500"
                />
              </div>

              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="TOTAL UNITS SOLD"
                  statTitle={totalUnitsSold}
                  statArrow="up"
                  statPercent="Growing"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Since start"
                  statIconName="fas fa-box"
                  statIconColor="bg-blue-500"
                />
              </div>

              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="TOP COUNTRY"
                  statTitle={topCountry}
                  statArrow="up"
                  statPercent="Best Market"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Highest sales country"
                  statIconName="fas fa-globe"
                  statIconColor="bg-purple-500"
                />
              </div>

              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="TOP SELLING PLATFORM"
                  statTitle={topSellingPlatform}
                  statArrow="up"
                  statPercent="Popular"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Best performing platform"
                  statIconName="fas fa-store"
                  statIconColor="bg-yellow-500"
                />
              </div>

              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="TOP PRODUCT"
                  statTitle={topSellingProduct}
                  statArrow="up"
                  statPercent="Most Sold"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Best-selling product"
                  statIconName="fas fa-trophy"
                  statIconColor="bg-red-500"
                />
              </div>

              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="NUMBER OF COUNTRIES"
                  statTitle={numCountries}
                  statArrow="up"
                  statPercent="Active Markets"
                  statPercentColor="text-blue-500"
                  statDescripiron="Countries with sales"
                  statIconName="fas fa-flag"
                  statIconColor="bg-indigo-500"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
