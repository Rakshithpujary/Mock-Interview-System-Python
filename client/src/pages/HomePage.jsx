import React, { useState } from 'react';
import '../css/HomePage.css';
import { useNavigate } from 'react-router-dom';


function HomePage() {

  const [isStarted, setIsStarted] = useState(false);
  const [jobInput, setJobInput] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    setIsStarted(true);
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setJobInput(inputValue);

    // Check if input matches the regex pattern
    setIsValidInput(/^[a-zA-Z\s]{1,25}$/.test(inputValue));
  };

  const handleStartInterviewClick = () => {
    // Check if the input is valid before starting the interview
    if (isValidInput) {
      // Proceed to the next page if input is valid
      navigate('/interview');
      
    } else {
      // Inform the user that the input is invalid
      alert("Please enter vaild job title or limit is extended");
    }
  };

  return (
    <div className='Home-div'>
      <div className='header-div'>
        <h1 className='header-text'>Mock Interview</h1>
      </div>
      <div className='context-div'>
        <img src={'/assets/homePagePic.jpg'} alt="Background" />
        {!isStarted && (
          <>
            <h1>Land your dream job by prepping for interviews from the comfort of your couch.</h1>
            <button className='getStartedButton' onClick={handleGetStartedClick}>Get Started</button>
          </>
        )}
        {isStarted && (
          <>
            <label className='joblabel'>Enter job role</label>
            <input className='jobinput' type='text' value={jobInput} onChange={handleInputChange} maxLength={25}/>
            <button className='StartInterviewButton' onClick={handleStartInterviewClick}>Start your interview</button>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
