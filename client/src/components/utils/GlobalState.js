import React, { createContext, useEffect, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [gJobRole, setGJobRole] = useState('');
  const [gJobExp, setGJobExp] = useState('');
  const [gQtns, setGQtns] = useState([]);
  const [gAns, setGAns] = useState([]);
  const [gValidInterview, setGValidInterview] = useState(null); // should be null
  const [gValidReview, setGValidReview] = useState(false);
  const [gSuspiciousCount, setGSuspiciousCount] = useState(0);
  const [gEmotionData, setGEmotionData] = useState("User did not turn on camera, hence no emotion analysis data is available");

  const updateGQtnGenerationData = (jobRole, jobExp, questions) => {
    setGJobRole(jobRole);
    setGJobExp(jobExp);
    setGQtns(questions);
  };

  return (
    <GlobalContext.Provider value={{ gJobRole, gJobExp, gQtns, gValidInterview,
     updateGQtnGenerationData, setGValidInterview,
     gSuspiciousCount, setGSuspiciousCount,
     gAns, setGAns,
     gEmotionData, setGEmotionData,
     gValidReview, setGValidReview }}
    >
      {children}
    </GlobalContext.Provider>
  );
};