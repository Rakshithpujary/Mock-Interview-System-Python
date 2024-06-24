import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InterviewPage from './pages/InterviewPage';
import { GlobalProvider } from './components/utils/GlobalState';
import ReviewPage from './pages/ReviewPageNew';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </GlobalProvider>
    </Router>
  );
}

export default App;