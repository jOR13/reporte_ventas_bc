import React from "react";
import { Bar } from "@reactchartjs/react-chart.js";

function Chart({ datos }) {
  console.log(datos);

  const data = {
    labels: datos.map((e) => Math.abs(e.Precio).toFixed(2)),
    datasets: [
      {
        label: "Precio promedio",
        data: datos.map((e) => Math.abs(e.Sales_Amount__Actual_)),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <>
      {datos.length > 0 ? (
        <div>
          <div className="header">
            <h1 className="title">
              Precios de venta al dia 
            </h1>
            <div className="links"></div>
          </div>
          <Bar data={data} options={options} />
        </div>
      ) : null}
    </>
  );
}

export default Chart;
