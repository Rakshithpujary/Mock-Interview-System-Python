import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InterviewPage from './pages/InterviewPage'; // Import the InterviewPage component
import FaceRecognition from './pages/FaceRecognition';
import { GlobalProvider } from './components/utils/GlobalState';

function App() {
  return (
    <Router>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/testing" element={<FaceRecognition />} />
        </Routes>
      </GlobalProvider>
    </Router>
  );
}

export default App;
