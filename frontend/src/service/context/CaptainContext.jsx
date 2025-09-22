import React, { createContext, useState } from "react";

export const CaptainData = createContext();

function CaptainContext({ children }) {
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCaptain = (captainData) => {
    setCaptain(captainData);
  };

  const value = {
    captain,
    setCaptain,
    isLoading,
    setIsLoading,
    error,
    setError,
    updateCaptain,
  };

  return (
    <div>
      <CaptainData.Provider value={value}>
        {children}
      </CaptainData.Provider>
    </div>
  );
}

export default CaptainContext;
