import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "./Chart";

function Ventas() {
  let hoy = new Date();

  const [datos, setDatos] = useState([]);
  const [date, setDate] = useState(hoy.toISOString().slice(0, 10));
  const [promedio, setPromedio] = useState("");
  const [promedioAcum, setPromedioAcum] = useState("");
  const [filtro, setFiltro] = useState(0);
  const [sumatoria, setSumatoria] = useState(0);

  useEffect(() => {
    // readWSDia();

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

    if (date !== "") {
      let f = date.slice(8, 10);
      const fecha = new Date(date);
      let dias = parseInt(f - 1);
      let restaDias = 1000 * 60 * 60 * 24 * dias;
      let resta = fecha.getTime() - restaDias;
      let fechaIni = new Date(resta);

      // console.log({"dias de corte": dias, "fecha: ": fechaIni.toISOString().slice(0, 10), "fecha fin:": date });

      setFiltro(
        `?$filter=Posting_Date gt ${fechaIni
          .toISOString()
          .slice(0, 10)} and Posting_Date lt ${date}`
      );
    } else {
      setFiltro(`?$filter=Posting_Date eq ${date}`);
    }

    const url =
      "https://api.businesscentral.dynamics.com/v2.0/0acf03fd-2058-4005-bc16-b2184931a7bc/Production/ODataV4/Company('COMERCIALIZADORA%20DE%20COMBUSTIBL')/Query_Ventas" +
      filtro;
    // const data = {};

    const respuesta = await axios.get(url, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    let suma = 0;
    let sumaAcum = 0;

    let pd = respuesta.data.value.filter((e) => e.Posting_Date === date);

    const res = respuesta.data.value;
    setDatos(res);

    for (let i = 0; i < pd.length; i++) {
      pd[i].PrecioDiario = res[i].Sales_Amount__Actual_ / pd[i].Quantity;
      sumaAcum += pd[i].Sales_Amount__Actual_ / pd[i].Quantity;
    }

    for (let i = 0; i < res.length; i++) {
      res[i].Precio = res[i].Sales_Amount__Actual_ / res[i].Quantity;
      suma += res[i].Sales_Amount__Actual_ / res[i].Quantity;
    }

    // console.log(datos);

    setPromedio(suma / res.length);
    setPromedioAcum(sumaAcum / pd.length);
    setSumatoria(suma);
  };

  return (
    <>
      {" "}
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
        {/* <button className="btn btn-warning" onClick={(e) => readWsAcumluado(e)}>
          Promedio acumulado
        </button> */}
        {/* //  Sumatoria: {Math.abs(sumatoria).toFixed(2)}  */}
      </div>
      {datos.length > 0 ? (
        <div>
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-3">
              <div
                className="card"
                style={{
                  width: "18rem",
                  color: "black",
                  font: "-webkit-small-control",
                }}
              >
                <div className="card-body">
                  <b>Promedio del precio acumulado:</b>
                  <h3>
                    {" "}
                    <b>{Math.abs(promedio).toFixed(2)}</b>
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div
                className="card"
                style={{
                  width: "18rem",
                  color: "black",
                  font: "-webkit-small-control",
                }}
              >
                <div className="card-body">
                  <b>Promedio del precio al dia: {date}</b>
                  <h3>
                    {" "}
                    <b>{Math.abs(promedioAcum).toFixed(2)}</b>
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3"></div>
          </div>
          <div className="col-md-12">
            <Chart datos={datos} />
            {/* <Radar /> */}
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
                      {Math.abs(d.Sales_Amount__Actual_ / d.Quantity).toFixed(
                        2
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <h1>No se han encontrado ventas</h1>
      )}
    </>
  );
}

export default Ventas;
