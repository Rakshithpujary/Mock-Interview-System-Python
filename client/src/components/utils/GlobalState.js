import React, { createContext, useEffect, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [gJobTitle, setGJobTitle] = useState('');
  const [gQtns, setGQtns] = useState([]);
  const [gValidInterview, setGValidInterview] = useState(null);
  const [gSuspiciousCount, setGSuspiciousCount] = useState(0);
  const [gEmotionData, setGEmotionData] = useState(null);

  const updateGJobAndQnts = (jobTitle, questions) => {
    setGJobTitle(jobTitle);
    setGQtns(questions);
  };

  // useEffect(()=>{
  //   console.log("EMotion global data = ", gEmotionData);
  // },[gEmotionData])

  return (
    <GlobalContext.Provider value={{ gJobTitle, gQtns, gValidInterview,
     updateGJobAndQnts, setGValidInterview,
     gSuspiciousCount, setGSuspiciousCount,
     gEmotionData, setGEmotionData }}
     >
      {children}
    </GlobalContext.Provider>
  );
};