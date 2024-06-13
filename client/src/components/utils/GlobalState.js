// GlobalState.js
import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [gJobTitle, setGJobTitle] = useState('');
  const [gQtns, setGQtns] = useState([]);

  const updateGJobAndQnts = (jobTitle, questions) => {
    setGJobTitle(jobTitle);
    setGQtns(questions);
  };

  return (
    <GlobalContext.Provider value={{ gJobTitle, gQtns, updateGJobAndQnts }}>
      {children}
    </GlobalContext.Provider>
  );
};