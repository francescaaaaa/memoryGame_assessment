// CountdownContext.js
import React, { createContext, useState, useContext } from 'react';

const CountdownContext = createContext();

export const useCountdown = () => useContext(CountdownContext);

export const CountdownProvider = ({ children }) => {
  const [countdown, setCountdown] = useState(10);

  const updateCountdown = (newCountdown) => {
    setCountdown(newCountdown);
  };

  return (
    <CountdownContext.Provider value={{ countdown, updateCountdown }}>
      {children}
    </CountdownContext.Provider>
  );
};