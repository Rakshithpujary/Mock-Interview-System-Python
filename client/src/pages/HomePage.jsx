import React, { useContext, useState } from 'react';
import '../css/HomePage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/utils/toastStyle';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { GlobalContext } from '../components/utils/GlobalState';

function HomePage() {
  // access global values
  const { updateGJobAndQnts } = useContext(GlobalContext);
  
  const [jobInput, setJobInput] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const [isValidInput, setIsValidInput] = useState(false);
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
    setJobInput(inputValue.trim());
  
    // Check if the input is valid using the utility function
    // setIsValidInput(isValidJobTitle(inputValue));
  };

  const handleBackClick = () => {
    setIsVisible(true);
  };

  const handleStartInterviewClick = async () => {
    if (isValidJobTitle(jobInput)) {
      try {
        setIsLoading(true);
        const response = await axios.post('http://localhost:5000/api/get-questions', {
          job_title: jobInput
        });

        updateGJobAndQnts(response.data.jobTitle, response.data.qtns);
        navigate('/interview');
      } catch(error) {
        toast.error(error.response? error.response.data.errorMsg : error.message || error,
           {...toastErrorStyle(),autoClose: 2000
        });
        console.log("Something went wrong!", error.response? error.response.data.errorMsg : error.message || error);
      } finally {
          setIsLoading(false);
      }
    } else {
      toast.error("Please provide a valid jobf title!", {...toastErrorStyle(),autoClose: 2000
      });
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
            <input className='jobinput' type='text' value={jobInput} onChange={handleInputChange}
             required maxLength={35} placeholder='Eg: Java Developer'/>
            <button className='StartInterviewButton' onClick={handleStartInterviewClick}>
              { isLoading? <> Preparing Interview <FontAwesomeIcon icon={faSpinner} spin /> </>
              : 'Start your interview' }
            </button>
          </div>
      </div>
    </div>
  );
}

export default HomePage;
