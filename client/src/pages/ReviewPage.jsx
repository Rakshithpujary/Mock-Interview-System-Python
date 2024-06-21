import React, { useEffect, useState, useContext } from 'react';
import '../css/ReviewPage.css';
import Markdown from 'react-markdown'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/utils/toastStyle';
import { GlobalContext } from '../components/utils/GlobalState';

function App() {
  // access global values and functions
  const { gJobRole, gQtns, gAns, gEmotionData, gValidReview, gSuspiciousCount } = useContext(GlobalContext);

  const [validUpdated, setValidUpdated] = useState(false);
  const [ review, setReview] = useState('');
  const [displayText, setDisplayText] = useState('');

  const navigate = useNavigate();

  // typing effect--------------
  useEffect(()=>{
    let count = 0;
    let temp = "";
    const intervalId = setInterval(() => {
        if(count >= review.length) {
            clearInterval(intervalId);
            return;
        }
        temp += review[count];
        setDisplayText(temp);
        console.log("checking:",displayText)
        count++;
    }, 50);
    return () => clearInterval(intervalId);
},[review]);

  // check if valid entry to review page
  useEffect(()=>{
    if(!gValidReview) {
        window.location.replace('/'); // Re-direct to home page
    }
  },[]);

  // call getReview
  useEffect(()=>{
    getReview();
  },[gAns]); // call when ans data is loaded, then rest variables are assumed loaded

  const getReview = async () => {
    if(gAns.length === 0) return; // extra validation
    if(review !== '') return; // extra validation

    try {
      const response = await axios.post('http://localhost:5000/api/get-review', {
          job_role: gJobRole,
          qns: gQtns,
          ans: gAns,
          emotion: gEmotionData,
          suspiciousCount: gSuspiciousCount 
      });

      setReview(response.data.review);
    } catch(error) {
      toast.error(error.response ? error.response.data.errorMsg : error.message || error,
          { ...toastErrorStyle(), autoClose: 2000 }
      );
      console.log("Something went wrong!", error.response ? error.response.data.errorMsg : error.message || error);

      // re-direct to homepage if error occured
      // navigate('/', {replace : true});
    }
  }
        
  return (
        <div className='main-div'>
          {
            review.length <= 0? <>Loading...</> :
            <div>
              <div className='review-div'>
                <div className='robotImage-div'>
                  <img className='robotImage' src={'/assets/robot3.png'} alt="robot Image"/>
                  <h1>FeedBack</h1>
                </div>
                <Markdown>{displayText}</Markdown>
              </div>
              <div className='reviewPageContent-div'>
                <div className='innerContent1-div'>
                  <div className='Content1-div'></div>
                  <div className='Content2-div'></div>
                </div>
                <div className='innerContent2-div'>

                </div>

              </div>
            </div>
            
          }
        </div>
    );
}

export default App;