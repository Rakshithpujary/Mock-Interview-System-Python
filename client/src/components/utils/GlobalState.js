import React, { createContext, useEffect, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [gJobTitle, setGJobTitle] = useState('');
  const [gQtns, setGQtns] = useState([]);
  const [gValidInterview, setGValidInterview] = useState(null);
  const [suspiciousCount, setSuspiciousCount] = useState(0);

  const updateGJobAndQnts = (jobTitle, questions) => {
    setGJobTitle(jobTitle);
    setGQtns(questions);
  };

  // useEffect(()=>{
  //   console.log(suspiciousCount);
  // },[suspiciousCount])

  return (
    <GlobalContext.Provider value={{ gJobTitle, gQtns, gValidInterview,
     updateGJobAndQnts, setGValidInterview,
     suspiciousCount, setSuspiciousCount }}
     >
      {children}
    </GlobalContext.Provider>
  );
};