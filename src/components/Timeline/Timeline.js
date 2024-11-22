import React from "react";
import { useTranslation } from "react-i18next";
import "./timeline.css";
import { fetchShipmentData } from "../../API/api";
import { useEffect, useState } from "react";
import { useTracking } from "../../Context/TrackingContext";
const Timeline = () => {
  const [t, i18l] = useTranslation();
  const { trackingNumber } = useTracking(); // Access context
  const [data, setData] = useState(null);
  let currentStatus;
  let promisedDate;
  let nextDay;
  let nextDate;
  let textColor;

  useEffect(() => {
    if (trackingNumber) {
      fetchShipmentData(trackingNumber).then((result) => setData(result));
    }
  }, [trackingNumber]);

  // Function to get the date part (day month year with translated month)
  function getPromisedDate(dateTimeString, i18n) {
    const date = new Date(dateTimeString);

    // Array of month names in English
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Get the month in English and translate it using i18next
    const monthIndex = date.getMonth();
    const monthInEnglish = monthNames[monthIndex]; // Get the English month name

    // Fetch the translated month name from i18next using the key 'month_names.<MonthName>'
    const translatedMonth = t(`month_names.${monthInEnglish}`);

    const day = date.getDate();
    const year = date.getFullYear();

    return `${day} ${translatedMonth} ${year}`;
  }
  // Function to get the date part (day/month/year)
  function getFormattedDate(dateTimeString) {
    // Convert the ISO date-time string into a Date object
    const date = new Date(dateTimeString);

    // Extract date values (day/month/year)
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // Function to get the time part (hour:minute AM/PM)
  function getFormattedTime(dateTimeString) {
    // Convert the ISO date-time string into a Date object
    const date = new Date(dateTimeString);

    // Extract time values (hour:minute AM/PM)
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const isAM = hours < 12;
    const ampm = isAM ? "AM" : "PM";

    // Convert hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 12-hour format: 0 becomes 12

    return `${hours}:${minutes} ${ampm}`;
  }

  if (data) {
    if (data.CurrentStatus.state === "CANCELLED") {
      currentStatus = t("final_status.CANCELLED");
      textColor = "reject";
    } else if (data.CurrentStatus.state === "DELIVERED") {
      currentStatus = t("final_status.DELIVERED");
      textColor = "accept";
    } else if (data.CurrentStatus.state === "DELIVERED_TO_SENDER") {
      currentStatus = t("final_status.DELIVERED_TO_SENDER");
      textColor = "refused";
    }
    promisedDate = getPromisedDate(data.PromisedDate);
    if (data.nextWorkingDay) {
      nextDay = data.nextWorkingDay[0].dayName || null;
    }
    nextDate = data.CurrentStatus.timestamp;
  }

  return (
    <div className="container mt-5 head">
      <div className="row my-4 mx-3">
        <div className="col-md-6 col-lg-3 ">
          <h6>
            {`${t("shipment_title.Tracking_number")}: `}
            {trackingNumber || "  "}
          </h6>

          <h5 className={textColor}>{currentStatus}</h5>
        </div>
        {/* Render additional data if available */}
        {data ? (
          <>
            <div className="col-md-6 col-lg-3 ">
              <h6>{t("shipment_title.Current_status")}</h6>
              <h5>
                {nextDay && t(`days.${nextDay}`)} {getFormattedDate(nextDate)}{" "}
                {getFormattedTime(nextDate)}
              </h5>
            </div>
            <div className="col-md-6 col-lg-3 ">
              <h6>{t("shipment_title.provider")}</h6>
              <h5>{data.provider}</h5>
            </div>
            <div className="col-md-6 col-lg-3 ">
              <h6>{t("shipment_title.promised_date")} </h6>
              <h5>{promisedDate}</h5>
            </div>
          </>
        ) : (
          <div className="col-md-6 col-lg-3 ">
            <h6> </h6>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
