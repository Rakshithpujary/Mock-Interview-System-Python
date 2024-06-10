import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InterviewPage from './pages/InterviewPage'; // Import the InterviewPage component
<<<<<<< HEAD
// import FaceRecognition from './pages/FaceRecognition';
=======
>>>>>>> 2a60e916dbcf9c49cb0a8446411563cda21693a1
import { GlobalProvider } from './components/utils/GlobalState';
import Testing from './components/Testing';

function App() {
  return (
    <Router>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/interview" element={<InterviewPage />} />
<<<<<<< HEAD
          {/* <Route path="/testing" element={<FaceRecognition />} /> */}
=======
          <Route path="/testing" element={<Testing />} />
>>>>>>> 2a60e916dbcf9c49cb0a8446411563cda21693a1
        </Routes>
      </GlobalProvider>
    </Router>
  );
}

export default App;
