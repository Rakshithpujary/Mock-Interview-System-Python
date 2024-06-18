import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InterviewPage from './pages/InterviewPage'; // Import the InterviewPage component
import { GlobalProvider } from './components/utils/GlobalState';
import Testing from './components/Testing';
import ReviewPage from './pages/ReviewPage';

function App() {
  return (
    <Router>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </GlobalProvider>
    </Router>
  );
}

export default App;