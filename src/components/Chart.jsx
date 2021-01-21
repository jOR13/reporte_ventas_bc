import React from "react";
import { Bar } from "@reactchartjs/react-chart.js";

function Chart({ datos }) {
  // console.log(datos);

  //daviiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiis heeeeeeeeeeeeelppp
  let jmancof = [];

  datos.map((v, ix) => {
    if (v.Precio) {
      let mc = jmancof.filter((f) => {
        if (f.Posting_Date) return f.Posting_Date === v.Posting_Date;
        else return false;
      });

      if (mc.length <= 0)
        jmancof.push({ Posting_Date: v.Posting_Date, Precio: v.Precio });
      else{
        

        let jm = datos.filter((m) => {
          return m.Posting_Date === v.Posting_Date;
        });

        jmancof.filter((m) => {
          return m.Posting_Date === v.Posting_Date;
        }).map((m) => {
          m.Precio += v.Precio;
          m.Promedio = m.Precio / jm.length;
        });

      }
        

      // if (mc.length <= 0)
      //   jmancof.push({ fecha: v.Posting_Date, precio: v.Precio });
      // else
      //   jmancof[ix].precio += v.Precio;
    }
  });
  // console.log(jmancof);

  const data = {
    labels: jmancof.map((e) => e.Posting_Date),
    datasets: [
      {
        label: "Precio dia",
        data: jmancof.map((e) => Math.abs(e.Promedio).toFixed(2)),
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
            <h1 className="title">Precios de venta al dia</h1>
            <div className="links"></div>
          </div>
          <Bar data={data} options={options} />
        </div>
      ) : null}
    </>
  );
}

export default Chart;
