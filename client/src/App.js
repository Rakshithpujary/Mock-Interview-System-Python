import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import InterviewPage from "./pages/InterviewPage";
import ReviewPage from "./pages/ReviewPageNew";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import { GlobalProvider } from "./components/utils/GlobalState";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </GlobalProvider>
    </Router>
  );
}

export default App;
