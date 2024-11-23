import { React, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faCheck,
  faClipboardList,
  faTicket,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "react-bootstrap";
import "./progress.css"; // Ensure you have this file for custom styles
import { useTracking } from "../../Context/TrackingContext";
import { fetchShipmentData } from "../../API/api";
import { useTranslation } from "react-i18next";

const ShipmentProgress = () => {
  const steps = [
    { icon: faTicket, label: "Shipped" },
    { icon: faBoxOpen, label: "In Transit" },
    { icon: faTruck, label: "Cancelled" },
    { icon: faClipboardList, label: "Delivered" },
  ];

  const shipmentProgress = [
    "TICKET_CREATED",
    "PACKAGE_RECEIVED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];
  const [t, i18l] = useTranslation();

  const [currentStep, setCurrentStep] = useState(0); // Start at 0, no circles are active
  const [isRtl, setIsRtl] = useState(document.documentElement.dir === "rtl");
  const [data, setData] = useState([]);
  const { trackingNumber } = useTracking();

  useEffect(() => {
    const handleDirectionChange = () => {
      const rtl = document.documentElement.dir === "rtl";
      setIsRtl(rtl);
    };

    handleDirectionChange();

    const observer = new MutationObserver(() => {
      handleDirectionChange();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (trackingNumber) {
      // Reset progress and circles when a new tracking number is entered
      setCurrentStep(0);
      setData([]); // Clear the previous data
      console.log("Progress reset for new tracking number");

      fetchShipmentData(trackingNumber)
        .then((result) => {
          const transitEvents = result.TransitEvents || []; // Safely handle undefined
          setData(transitEvents); // Set state for React
          console.log("Data has been set");

          // Use transitEvents directly for condition checks
          if (checkTransitStates(transitEvents, "TICKET_CREATED")) {
            handleNextStep();
            if (checkTransitStates(transitEvents, "PACKAGE_RECEIVED")) {
              handleNextStep();
              if (checkTransitStates(transitEvents, "OUT_FOR_DELIVERY")) {
                handleNextStep();
                if (checkTransitStates(transitEvents, "DELIVERED")) {
                  handleNextStep();
                }
              }
            }
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [trackingNumber]);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1); // Increment step up to 4 (index 0 to 4)
    }
  };

  const adjustedSteps = isRtl ? steps.reverse() : steps;
  const progressValue = Math.min((currentStep / 3) * 100, 100); // Progress bar fills only up to 100%

  const checkTransitStates = (transitEvents, targetState) => {
    if (!Array.isArray(transitEvents)) {
      console.error("Invalid input: transitEvents should be an array.");
      return false;
    }

    return transitEvents.some((event) => event.state === targetState);
  };

  return (
    <div className="container text-center progressContain py-4 ">
      <div className="shipment-progress  justify-content-center">
        <div
          className="progress-container text-center"
          style={{ position: "relative" }}
        >
          {/* React Bootstrap ProgressBar (no RTL effect here) */}
          <div style={{ position: "relative", width: "100%" }}>
            <ProgressBar
              now={progressValue}
              className="progress-bar"
              variant="success"
              style={{ position: "absolute", width: "100%" }}
            />
          </div>

          {/* Circles positioned on the progress bar */}
          <div
            className="circles-container"
            style={{ position: "relative", width: "100%" }}
          >
            {adjustedSteps.map((step, index) => {
              const isActive = currentStep > index; // Active if currentStep is greater than the index
              const circleClass = isActive ? "active" : ""; // Apply 'active' class for filled circles
              const icon = isActive ? faCheck : step.icon; // Change to checkmark if active

              return (
                <>
                  <div
                    key={index}
                    className={`circle ${circleClass}`}
                    style={{
                      position: "absolute",
                      [isRtl ? "right" : "left"]: `${(index * 100) / 3}%`, // Position circles based on RTL
                      transform: `translateX(-50%) ${
                        isRtl ? "translateX(30px)" : ""
                      }`, // Move 30px when RTL
                    }}
                  >
                    <FontAwesomeIcon icon={icon} size="lg" />
                  </div>
                </>
              );
            })}

            {shipmentProgress.map((item, index) => {
              return (
                <div
                  className="d-flex justify-content-center align-items-center m-auto px-2"
                  style={{
                    marginRight: isRtl ? "0px" : undefined,
                    paddingRight: isRtl ? "0px" : undefined, // Set padding-right to 0px only when RTL
                    position: "absolute",
                    [isRtl ? "right" : "left"]: `${(index * 100) / 3}%`, // Position circles based on RTL
                    transform: `translateX(-50%) ${
                      isRtl ? "translateX(30px)" : ""
                    }`, // Move 30px when RTL
                    top: "40px", // Moves the circles downward
                  }}
                >
                  <h6>{t(`shipment_progress.${item}`)}</h6>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentProgress;
