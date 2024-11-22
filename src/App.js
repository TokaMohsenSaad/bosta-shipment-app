import "./App.css";
import { useState } from "react";
import Header from "./components/Header";
import Timeline from "./components/Timeline/Timeline";
import "bootstrap/dist/css/bootstrap.min.css";
import { TrackingProvider } from "./Context/TrackingContext";
import ShipmentProgress from "./components/ProgressBar/ShipmentProgress";

function App() {
  return (
    <div>
      <TrackingProvider>
        <Header></Header>
        <Timeline></Timeline>
        <ShipmentProgress></ShipmentProgress>
      </TrackingProvider>
    </div>
  );
}

export default App;
