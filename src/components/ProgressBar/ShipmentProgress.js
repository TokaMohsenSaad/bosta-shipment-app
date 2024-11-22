import React from "react";
import { Row, Col, ProgressBar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faBoxOpen,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./progress.css"; // For custom styles

const ShipmentProgress = ({ currentStep }) => {
  const steps = [
    { icon: faTruck, label: "Shipped" },
    { icon: faBoxOpen, label: "In Transit" },
    { icon: faCheckCircle, label: "Delivered" },
    { icon: faTimesCircle, label: "Cancelled" },
  ];

  return (
    <div className="shipment-progress">
      <Row className="justify-content-center">
        {steps.map((step, index) => {
          const isActive = currentStep >= index + 1;
          return (
            <Col
              key={index}
              xs={3}
              className={`d-flex justify-content-center ${
                isActive ? "active" : ""
              }`}
            >
              <div className={`circle ${isActive ? "completed" : ""}`}>
                <FontAwesomeIcon icon={step.icon} size="lg" />
              </div>
            </Col>
          );
        })}
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <ProgressBar now={(currentStep / 4) * 100} />
        </Col>
      </Row>
    </div>
  );
};

export default ShipmentProgress;
