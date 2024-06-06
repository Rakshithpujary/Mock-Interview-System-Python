import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InterviewPage from './pages/InterviewPage'; // Import the InterviewPage component
import FaceRecognition from './pages/FaceRecognition';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/testing" element={<FaceRecognition />} />
      </Routes>
    </Router>
  );
}

export default App;