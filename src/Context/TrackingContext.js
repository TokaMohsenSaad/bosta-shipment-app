import React, { createContext, useContext, useState } from "react";

// Create Context
const TrackingContext = createContext();

// Provider Component
export const TrackingProvider = ({ children }) => {
  const [trackingNumber, setTrackingNumber] = useState("");

  return (
    <TrackingContext.Provider value={{ trackingNumber, setTrackingNumber }}>
      {children}
    </TrackingContext.Provider>
  );
};

// Custom Hook for Context
export const useTracking = () => useContext(TrackingContext);
