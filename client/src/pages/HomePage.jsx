import React, { useState } from 'react';
import '../css/HomePage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/utils/toastStyle';
import { FaArrowLeftLong } from "react-icons/fa6";


function HomePage() {

  const [jobInput, setJobInput] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isValidInput, setIsValidInput] = useState(false);
  const navigate = useNavigate();

    const isValidJobTitle = (input) => {
    const isNotEmpty = input.trim().length > 0;
    const isWithinLength = input.length <= 25;
    const isValidCharacters = /^[a-zA-Z\s]+$/.test(input);
  
    return isNotEmpty && isWithinLength && isValidCharacters;
  };

  const handleGetStartedClick = () => {
    setIsVisible(false); // Hide the button
  };
  
  
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setJobInput(inputValue);
  
    // Check if the input is valid using the utility function
    setIsValidInput(isValidJobTitle(inputValue));
  };

  const handleBackClick = () => {
    setIsVisible(true);
  };

    const handleStartInterviewClick = () => {
      if (isValidJobTitle(jobInput)) {
        // Proceed to the next page if input is valid
        navigate('/interview');
      } else if (jobInput.trim().length === 0) {
        // Check if the input is empty
        toast.error("Please enter a job title. It can't be empty.", {...toastErrorStyle(),autoClose: 2000
        });
      } else if (jobInput.length > 35) {
        // Check if the input exceeds 25 characters
        toast.error("Please enter a job title with no more than 25 characters.", {...toastErrorStyle(),autoClose: 2000});
      } else {
        // Inform the user that the input is invalid
        toast.error("Please enter a valid job title.", {...toastErrorStyle(),autoClose: 2000});
      }
    };
    

  return (
    <div className='Home-div'>
      <div className='header-div'>
        <h1 className='header-text'>MOCK INTERVIEW</h1>
      </div>
      <div className='context-div'>
        
        <div className='text-div'>
          <h1>Land your dream job by prepping for interviews from the comfort of your couch.</h1>
          <button
          className={`getStartedButton ${!isVisible && 'hidden'}`}
          onClick={handleGetStartedClick}>Get Started</button>

        </div>

        <div className='img-div'>
          <img className='image' src={'/assets/homePagePic3.jpg'} alt="Background" />
        </div>
        <div className={`jobTitle-div ${isVisible && 'hidden'}`}>
            <FaArrowLeftLong className='Left-arrow' onClick={handleBackClick}/>
            <label className='joblabel'>Enter job role</label>
            <input className='jobinput' type='text' value={jobInput} onChange={handleInputChange} required/>
            <button className='StartInterviewButton' onClick={handleStartInterviewClick}>Start your interview</button>
          </div>
      </div>
    </div>
  );
}

export default HomePage;
