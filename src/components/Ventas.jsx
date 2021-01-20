import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "./Chart";
import Radar from "./Radar";
function Ventas() {
  const [datos, setDatos] = useState([]);
  const [date, setDate] = useState("");
  const [promedio, setPromedio] = useState(0);
  const [sumatoria, setSumatoria] = useState(0);

  useEffect(() => {
    //readWSDia();
    readWsAcumluado();
  }, [date]);

  const onChangeDate = (e) => {
    setDate(e.target.value);
  };

  const readWSDia = async () => {
    const username = "ADMINGLOBAL";
    const password = "fVl4j9CNddUK+EKLpZ/vOc59Sj8FPQ+JxtVcmn0EGPU=";
    const token = Buffer.from(`${username}:${password}`, "utf8").toString(
      "base64"
    );

    const filtro = `?$filter=Posting_Date eq ${date}`;
    // const filtro = "";

    const url =
      "https://api.businesscentral.dynamics.com/v2.0/0acf03fd-2058-4005-bc16-b2184931a7bc/Production/ODataV4/Company('COMERCIALIZADORA%20DE%20COMBUSTIBL')/Query_Ventas" +
      filtro;
    // const data = {};

    const respuesta = await axios.get(url, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    setDatos(respuesta.data.value);

    // console.log(respuesta.data.value);

    let suma = 0;

    for (let i = 0; i < respuesta.data.value.length; i++) {
      respuesta.data.value[i].Precio =
        respuesta.data.value[i].Sales_Amount__Actual_ /
        respuesta.data.value[i].Quantity;
      suma +=
        respuesta.data.value[i].Sales_Amount__Actual_ /
        respuesta.data.value[i].Quantity;
    }

    setPromedio(suma / respuesta.data.value.length);
    setSumatoria(suma);
  };

  const readWsAcumluado = async () => {
    const username = "ADMINGLOBAL";
    const password = "fVl4j9CNddUK+EKLpZ/vOc59Sj8FPQ+JxtVcmn0EGPU=";
    const token = Buffer.from(`${username}:${password}`, "utf8").toString(
      "base64"
    );

    let f = date.slice(8, 10);

    const fecha = new Date(date).toISOString();

    function sumarDias(fecha, dias) {
      fecha.setDate(fecha.getDate() + dias);
      return fecha;
    }

    console.log({ "fecha seleccionada: ": date, "fecha2:": fecha });

    console.log(sumarDias(fecha, -5));
    // const filtro = `?$filter=Posting_Date gt ${nd} and Posting_Date lt ${date}`;
    const filtro = `?$filter=Posting_Date eq ${date}`;

    const url =
      "https://api.businesscentral.dynamics.com/v2.0/0acf03fd-2058-4005-bc16-b2184931a7bc/Production/ODataV4/Company('COMERCIALIZADORA%20DE%20COMBUSTIBL')/Query_Ventas" +
      filtro;
    // const data = {};

    const respuesta = await axios.get(url, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    setDatos(respuesta.data.value);

    let suma = 0;

    for (let i = 0; i < respuesta.data.value.length; i++) {
      respuesta.data.value[i].Precio =
        respuesta.data.value[i].Sales_Amount__Actual_ /
        respuesta.data.value[i].Quantity;
      suma +=
        respuesta.data.value[i].Sales_Amount__Actual_ /
        respuesta.data.value[i].Quantity;
    }

    setPromedio(suma / respuesta.data.value.length);
    setSumatoria(suma);
  };

  return (
    <>
      <div className="col-md-12">
        <div>
          <input
            type="date"
            className="form-control mt-4 mb-4"
            placeholder="Fecha ejemplo: 2020-12-01"
            value={date}
            onChange={onChangeDate}
          />
        </div>

        {/* //  Sumatoria: {Math.abs(sumatoria).toFixed(2)}  */}
      </div>

      <div className="col-md-6">
        <Chart datos={datos} />
        {/* <Radar /> */}
      </div>

      <div className="col-md-6">
        <div
          className="card"
          style={{
            width: "18rem",
            color: "black",
            font: "-webkit-small-control",
          }}
        >
          <div className="card-body">
            <p className="card-text">
              <b> Precio promedio de venta:</b>
              <h3>
                {" "}
                <b>{Math.abs(promedio).toFixed(2)}</b>
              </h3>
            </p>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <table
          style={{
            borderCollapse: "collapse",
            borderSpacing: 0,
            width: "100%",
            whiteSpace: "nowrap",
            color: "white",
          }}
          className="table responsive"
        >
          <thead>
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col">No</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Tipo</th>
              <th scope="col">Importe de venta</th>
              <th scope="col">Precio de venta</th>
            </tr>
          </thead>

          <tbody>
            {datos.map((d) => (
              <tr key={d.AuxiliaryIndex1}>
                <td>{d.Posting_Date}</td>
                <td>{d.Document_No_}</td>
                <td>{Math.abs(d.Quantity)}</td>
                <td>{d.Entry_Type}</td>
                <td>{d.Sales_Amount__Actual_}</td>
                <td>
                  {Math.abs(d.Sales_Amount__Actual_ / d.Quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Ventas;
