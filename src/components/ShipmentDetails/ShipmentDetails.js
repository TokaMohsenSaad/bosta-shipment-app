import React from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { fetchShipmentData } from "../../API/api";
import { useEffect, useState } from "react";
import { useTracking } from "../../Context/TrackingContext";
import "./shipment.css";
import think from "../../images/thinking.png";

const ShipmentDetails = () => {
  const [t] = useTranslation();

  const { trackingNumber } = useTracking();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (trackingNumber) {
      fetchShipmentData(trackingNumber).then((result) =>
        setData(result.TransitEvents)
      );
    }
  }, [trackingNumber]);

  function formatDate(dateTimeString) {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }

  return (
    <div className="container mt-5 m-auto">
      <div className="row">
        <div className="col-lg-6 w-50">
          <h5>{t("table_head.Shipment_Details")}</h5>
          <Table responsive="sm">
            <thead className="address-box">
              <tr>
                <th>{t("table_head.Branch")}</th>
                <th>{t("table_head.Date")}</th>
                <th>{t("table_head.Time")}</th>
                <th>{t("table_head.Details")}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className=" my-2 mx-2 table-content w-25">
                    {item.hub ? t(`hub.${item.hub}`) : ""}
                  </td>
                  <td className=" my-2 mx-2 table-content w-25">
                    {formatDate(item.timestamp)}
                  </td>
                  <td className="my-2 mx-2 table-content w-25">
                    {formatTime(item.timestamp)}
                  </td>
                  <td className=" my-2 mx-2 table-content w-25">
                    {t(`shipment_progress.${item.state}`)}
                    {item.reason &&
                      ` - ${t(`shipment_progress.${item.reason}`)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="col-lg-6  mx-5 address-container">
          <h5>{t("address.address_head")}</h5>
          <div className="container address-box py-4">
            <h6>{t("address.add")}</h6>
          </div>
          <div className="container address-box py-4 my-3">
            <div className="row">
              <div className="col w-25">
                <div className="w-75">
                  <img src={think} alt="thinking" className="image-think" />
                </div>
              </div>
              <div className="col w-75">
                <h6>{t("address.problem")}</h6>
                <button className="btn btn-danger btn-lg fs-6">
                  {t("address.button")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
