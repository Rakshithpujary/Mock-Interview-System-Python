// GlobalState.js
import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [camDisturbanceCount, setCamDisturbanceCount] = useState("");

  return (
    <GlobalContext.Provider value={{ camDisturbanceCount, setCamDisturbanceCount }}>
      {children}
    </GlobalContext.Provider>
  );
};