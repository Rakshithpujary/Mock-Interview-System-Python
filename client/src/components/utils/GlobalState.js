import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [gJobTitle, setGJobTitle] = useState('');
  const [gQtns, setGQtns] = useState([]);
  const [gValidInterview, setGValidInterview] = useState(false);

  const updateGJobAndQnts = (jobTitle, questions) => {
    setGJobTitle(jobTitle);
    setGQtns(questions);
  };

  return (
    <GlobalContext.Provider value={{ gJobTitle, gQtns, gValidInterview, updateGJobAndQnts, setGValidInterview }}>
      {children}
    </GlobalContext.Provider>
  );
};