import React from "react";
import Chart from "react-apexcharts";

export default function StockGraph({ options, data, name, type }) {
  // This provides a reusable component for constructing the graphs in price history
  return (
    <Chart
      series={[{ name: name, data: data }]}
      options={options}
      type={type}
      height={350}
    />
  );
}
