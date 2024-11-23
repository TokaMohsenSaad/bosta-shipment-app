// import { React, useState, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faBoxOpen,
//   faCheck,
//   faClipboardList,
//   faTicket,
//   faTruck,
// } from "@fortawesome/free-solid-svg-icons";
// import { ProgressBar } from "react-bootstrap";
// import "./progress.css"; // Ensure you have this file for custom styles
// import { useTracking } from "../../Context/TrackingContext";
// import { fetchShipmentData } from "../../API/api";
// import { useTranslation } from "react-i18next";

// const ShipmentProgress = () => {
//   const steps = [
//     { icon: faTicket, label: "Shipped" },
//     { icon: faBoxOpen, label: "In Transit" },
//     { icon: faTruck, label: "Cancelled" },
//     { icon: faClipboardList, label: "Delivered" },
//   ];

//   const shipmentProgress = [
//     "TICKET_CREATED",
//     "PACKAGE_RECEIVED",
//     "OUT_FOR_DELIVERY",
//     "DELIVERED",
//   ];
//   const [t, i18l] = useTranslation();

//   const [currentStep, setCurrentStep] = useState(0); // Start at 0, no circles are active
//   const [isRtl, setIsRtl] = useState(document.documentElement.dir === "rtl");
//   const [data, setData] = useState([]);
//   const { trackingNumber } = useTracking();
//   const [finalState, setFinalState] = useState(null);
//   let colors;

//   useEffect(() => {
//     const handleDirectionChange = () => {
//       const rtl = document.documentElement.dir === "rtl";
//       setIsRtl(rtl);
//     };

//     handleDirectionChange();

//     const observer = new MutationObserver(() => {
//       handleDirectionChange();
//     });

//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["dir"],
//     });

//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     if (trackingNumber) {
//       // Reset progress and circles when a new tracking number is entered
//       setCurrentStep(0);
//       setData([]); // Clear the previous data
//       console.log("Progress reset for new tracking number");

//       fetchShipmentData(trackingNumber)
//         .then((result) => {
//           const transitEvents = result.TransitEvents || []; // Safely handle undefined
//           setData(transitEvents); // Set state for React
//           const state = result.CurrentStatus.state;
//           setFinalState(state);
//           console.log(`final state is ${finalState}`);
//           console.log("Data has been set");

//           // Use transitEvents directly for condition checks
//           if (checkTransitStates(transitEvents, "TICKET_CREATED")) {
//             handleNextStep();
//             if (checkTransitStates(transitEvents, "PACKAGE_RECEIVED")) {
//               handleNextStep();
//               if (checkTransitStates(transitEvents, "OUT_FOR_DELIVERY")) {
//                 handleNextStep();
//                 if (checkTransitStates(transitEvents, "DELIVERED")) {
//                   handleNextStep();
//                 }
//               }
//             }
//           }
//           if (finalState === "CANCELLED") {
//             colors = "reject";
//           } else if (finalState === "DELIVERED") {
//             colors = "accept";
//           } else if (finalState === "DELIVERED_TO_SENDER") {
//             colors = "refuse";
//           }
//         })
//         .catch((error) => console.error("Error fetching data:", error));
//     }
//   }, [trackingNumber]);

//   const handleNextStep = () => {
//     if (currentStep < 4) {
//       setCurrentStep((prev) => prev + 1); // Increment step up to 4 (index 0 to 4)
//     }
//   };

//   const adjustedSteps = isRtl ? steps.reverse() : steps;
//   const progressValue = Math.min((currentStep / 3) * 100, 100); // Progress bar fills only up to 100%

//   const checkTransitStates = (transitEvents, targetState) => {
//     if (!Array.isArray(transitEvents)) {
//       console.error("Invalid input: transitEvents should be an array.");
//       return false;
//     }

//     return transitEvents.some((event) => event.state === targetState);
//   };

//   return (
//     <div className="container text-center progressContain py-4  ">
//       <div className="shipment-progress   ">
//         <div
//           className="progress-container container text-center "
//           style={{ position: "relative" }}
//         >
//           {/* React Bootstrap ProgressBar (no RTL effect here) */}
//           <div style={{ position: "relative", width: "100%" }}>
//             <ProgressBar
//               now={progressValue}
//               className="progress-bar"
//               variant={colors}
//               style={{
//                 position: "relative",
//                 width: isRtl ? "100%" : "100%",
//                 transform: isRtl ? "translateY(10px)" : "translateY(0)", // Shift for RTL
//                 marginRight: isRtl ? "0px" : "0px",
//               }}
//             />
//           </div>

//           {/* Circles positioned on the progress bar */}
//           <div
//             className="circles-container"
//             style={{ position: "relative", width: "100%" }}
//           >
//             {adjustedSteps.map((step, index) => {
//               const isActive = currentStep > index; // Active if currentStep is greater than the index
//               const circleClass = isActive ? colors : ""; // Apply 'active' class for filled circles
//               const icon = isActive ? faCheck : step.icon; // Change to checkmark if active

//               return (
//                 <>
//                   <div
//                     key={index}
//                     className={`circle ${circleClass}`}
//                     style={{
//                       position: "absolute",
//                       [isRtl ? "right" : "left"]: `${(index * 100) / 3.1}%`, // Position circles based on RTL
//                       transform: `translateX(-50%) ${
//                         isRtl ? "translateX(22px)" : "translateX(18px)"
//                       }`, // Move 30px when RTL
//                     }}
//                   >
//                     <FontAwesomeIcon icon={icon} size="lg" />
//                   </div>
//                 </>
//               );
//             })}{" "}
//             {shipmentProgress.map((item, index) => {
//               return (
//                 <div
//                   className="d-flex m-auto  w-25 justify-content-center align-content-center" // Reduced horizontal padding using `px-1`
//                   style={{
//                     marginRight: isRtl ? "5px" : "0px", // Adjusted margin for RTL
//                     paddingRight: isRtl ? "5px" : "0px", // Adjusted padding for RTL
//                     position: "absolute",
//                     [isRtl ? "right" : "left"]: `${(index * 100) / 3}%`, // Position circles based on RTL
//                     transform: `translateX(-45%) ${
//                       isRtl ? "translateX(280px)" : "translateX(-7px)"
//                     }`, // Shift circles to the right for RTL
//                     top: "60px", // Moves the circles downward
//                   }}
//                 >
//                   <h6>{t(`shipment_progress.${item}`)}</h6>
//                 </div>
//               );
//             })}
//           </div>

//           {/* <div className="row ">
//             {shipmentProgress.map((item, index) => {
//               return (
//                 <div
//                   className="col-lg-3 m-auto mx-2 w-25" // Reduced horizontal padding using `px-1`
//                   style={{
//                     marginRight: isRtl ? "5px" : "0px", // Adjusted margin for RTL
//                     paddingRight: isRtl ? "5px" : "0px", // Adjusted padding for RTL
//                     position: "absolute",
//                     [isRtl ? "right" : "left"]: `${(index * 100) / 3}%`, // Position circles based on RTL
//                     transform: `translateX(-45%) ${
//                       isRtl ? "translateX(20px)" : ""
//                     }`, // Shift circles to the right for RTL
//                     top: "40px", // Moves the circles downward
//                   }}
//                 >
//                   <h6>{t(`shipment_progress.${item}`)}</h6>
//                 </div>
//               );
//             })}
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShipmentProgress;

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
  const [finalState, setFinalState] = useState(null);
  const [colors, setColors] = useState(""); // State for colors
  let color = "";

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

  // useEffect(() => {
  //   if (trackingNumber) {
  //     // Reset progress and circles when a new tracking number is entered
  //     setCurrentStep(0);
  //     setData([]); // Clear the previous data
  //     console.log("Progress reset for new tracking number");

  //     fetchShipmentData(trackingNumber)
  //       .then((result) => {
  //         const transitEvents = result.TransitEvents || []; // Safely handle undefined
  //         setData(transitEvents); // Set state for React
  //         const state = result.CurrentStatus.state;
  //         setFinalState(state);
  //         console.log(`final state is ${finalState}`);
  //         console.log("Data has been set");

  //         if (finalState === "CANCELLED") {
  //           setColors("danger");
  //         } else if (finalState === "DELIVERED") {
  //           setColors("success");
  //           console.log(` the value of colors is: ${colors}`);
  //         } else if (finalState === "DELIVERED_TO_SENDER") {
  //           setColors("warning");
  //         }

  //         // Use transitEvents directly for condition checks
  //         if (checkTransitStates(transitEvents, "TICKET_CREATED")) {
  //           handleNextStep();
  //           if (checkTransitStates(transitEvents, "PACKAGE_RECEIVED")) {
  //             handleNextStep();
  //             if (checkTransitStates(transitEvents, "OUT_FOR_DELIVERY")) {
  //               handleNextStep();
  //               if (checkTransitStates(transitEvents, "DELIVERED")) {
  //                 handleNextStep();
  //               }
  //             }
  //           }
  //         }
  //         // // Set color based on final state
  //         // if (finalState) {
  //         //   if (finalState === "CANCELLED") {
  //         //     setColors("danger");
  //         //   } else if (finalState === "DELIVERED") {
  //         //     setColors("success");
  //         //     console.log(` the value of colors is: ${colors}`);
  //         //   } else if (finalState === "DELIVERED_TO_SENDER") {
  //         //     setColors("warning");
  //         //   }
  //         // }
  //       })
  //       .catch((error) => console.error("Error fetching data:", error));
  //   }
  // }, [trackingNumber, finalState]);

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
          const state = result.CurrentStatus.state;
          setFinalState(state);
          console.log(`final state is ${state}`);
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

          // Now set the colors based on finalState

          if (state === "CANCELLED") {
            color = "danger";
          } else if (state === "DELIVERED") {
            color = "success";
          } else if (state === "DELIVERED_TO_SENDER") {
            color = "warning";
          }

          setColors(color); // Set the color
          console.log(`The value of colors is: ${color}`); // Log it right after setting it
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [trackingNumber]); // Run this effect whenever trackingNumber changes

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
    <div className="container text-center progressContain py-4  ">
      <div className="shipment-progress">
        <div
          className="progress-container container text-center "
          style={{ position: "relative" }}
        >
          {/* React Bootstrap ProgressBar (no RTL effect here) */}
          <div style={{ position: "relative", width: "100%" }}>
            <ProgressBar
              now={progressValue}
              className="progress-bar"
              variant={colors} // Apply the state-based color class
              style={{
                position: "relative",
                width: isRtl ? "100%" : "100%",
                transform: isRtl ? "translateY(10px)" : "translateY(0)", // Shift for RTL
                marginRight: isRtl ? "0px" : "0px",
              }}
            />
          </div>

          {/* Circles positioned on the progress bar */}
          <div
            className="circles-container"
            style={{ position: "relative", width: "100%" }}
          >
            {adjustedSteps.map((step, index) => {
              const isActive = currentStep > index; // Active if currentStep is greater than the index
              const circleClass = isActive ? colors : ""; // Apply 'active' class for filled circles
              const icon = isActive ? faCheck : step.icon; // Change to checkmark if active

              return (
                <div
                  key={index}
                  className={`circle ${circleClass}`}
                  style={{
                    position: "absolute",
                    [isRtl ? "right" : "left"]: `${(index * 100) / 3.1}%`, // Position circles based on RTL
                    transform: `translateX(-50%) ${
                      isRtl ? "translateX(22px)" : "translateX(18px)"
                    }`, // Move 30px when RTL
                  }}
                >
                  <FontAwesomeIcon icon={icon} size="lg" />
                </div>
              );
            })}{" "}
            {shipmentProgress.map((item, index) => {
              return (
                <div
                  className="d-flex m-auto  w-25 justify-content-center align-content-center" // Reduced horizontal padding using `px-1`
                  style={{
                    marginRight: isRtl ? "5px" : "0px", // Adjusted margin for RTL
                    paddingRight: isRtl ? "5px" : "0px", // Adjusted padding for RTL
                    position: "absolute",
                    [isRtl ? "right" : "left"]: `${(index * 100) / 3}%`, // Position circles based on RTL
                    transform: `translateX(-45%) ${
                      isRtl ? "translateX(280px)" : "translateX(-7px)"
                    }`, // Shift circles to the right for RTL
                    top: "60px", // Moves the circles downward
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
