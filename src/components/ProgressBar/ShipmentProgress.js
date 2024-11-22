import { React, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faBoxOpen,
  faTimesCircle,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "react-bootstrap";
import "./progress.css"; // Ensure you have this file for custom styles

const ShipmentProgress = () => {
  const steps = [
    { icon: faTruck, label: "Shipped" },
    { icon: faBoxOpen, label: "In Transit" },
    { icon: faTimesCircle, label: "Cancelled" },
    { icon: faCheck, label: "Completed" },
  ];

  const [currentStep, setCurrentStep] = useState(0); // Start at 0, no circles are active
  const [isRtl, setIsRtl] = useState(document.documentElement.dir === "rtl");

  // Update RTL direction dynamically when document direction changes
  useEffect(() => {
    const handleDirectionChange = () => {
      const rtl = document.documentElement.dir === "rtl";
      setIsRtl(rtl);
    };

    // Check initially and also set up an observer for changes in the direction
    handleDirectionChange(); // Initial check

    const observer = new MutationObserver(() => {
      handleDirectionChange();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    return () => observer.disconnect();
  }, []);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1); // Increment step up to 3 (index 0 to 3)
    }
  };

  // Adjust the order of the steps based on RTL
  const adjustedSteps = isRtl ? steps.reverse() : steps;

  // Calculate the progress based on the current step (each step corresponds to 33.3%)
  const progressValue = Math.min((currentStep / 3) * 100, 100); // Progress bar fills only up to 100%

  return (
    <div className="container text-center progressContain py-4 px-0">
      <div className="shipment-progress mx-5 justify-content-center">
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
              const isActive = currentStep >= index; // Active if currentStep is greater or equal to the index
              const circleClass = isActive ? "active" : ""; // Apply 'active' class for filled circles
              const icon = isActive ? faCheck : step.icon; // Change to checkmark if active

              return (
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
              );
            })}
          </div>
        </div>
        <button onClick={handleNextStep}>Next Step</button>
      </div>
    </div>
  );
};

export default ShipmentProgress;
