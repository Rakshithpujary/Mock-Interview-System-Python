import React, { useEffect, useState, useContext } from 'react';
import '../css/ReviewPage.css';
import Markdown from 'react-markdown'
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/utils/toastStyle';
import { GlobalContext } from '../components/utils/GlobalState';
import Canvas3D from '../components/utils/Canvas3D';
import { OrbitControls, useGLTF } from '@react-three/drei';

function App() {
  // access global values and functions
  const { gJobRole, gQtns, gAns, gEmotionData, gValidReview, gSuspiciousCount } = useContext(GlobalContext);

  const [ review, setReview] = useState('');
  const [displayText, setDisplayText] = useState('');

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
        count++;
    }, 40);
    return () => clearInterval(intervalId);
  },[review]);

  // check if valid entry to review page
  // useEffect(()=>{
  //   if(!gValidReview) {
  //       window.location.replace('/'); // Re-direct to home page
  //   }
  // },[]);

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
            <div className='MainReview-div'>
              <div className='review-div'>
              {
            review.length <= 0? <>
              <div className='loading-div'>
                <Canvas3D pos={[0,-3,0]} scale={[6.5,6.5,6.5]} modelPath={'/robot1.glb'} classname={'robotloading'} />
                  {/* <img className='robotloading' src={'/assets/robot3.png'} alt="robot Image"/> */}
                  <h1>Generating Review...</h1>
              </div>
            </> :<>
                <div className='robotImage-div'>
                  <Canvas3D pos={[0,-3,0]} scale={[6.5,6.5,6.5]} modelPath={'/robot1.glb'} classname={'robotImage'} />
                  {/* <img className='robotImage' src={'/assets/robot3.png'} alt="robot Image"/> */}
                  <h1>FeedBack</h1>
                </div>
                <Markdown>{displayText}</Markdown>
                </>
              }
              </div>
              {/* this is the main div to display thank you message and icon animation */}
              <div className='thankYouContent-div'>
                <div className='iconAndThankYou-div'>
                  <div className='MainModel-div'>
                    {/* this div is will display Thank You header */}
                    <div className='Content1-div'></div>
                    {/* this div is will display the model animation */}
                    <div className='Content2-div'>
                    <Canvas3D camera={{ position: [0, 100, 10] }} pos={[0,0,0]} scale={[1.5,1.5,1.5]} modelPath={'/box_animation1.glb'} classname={'ComputerImage'} />
                    </div>
                  </div>
                  <div className='message-div'>

                  </div>
                </div>
                <div className='ReInterviewAndThankYouMessage-div'>
                    <p>Thank you for participating in our mock interview program! Your commitment to growth and learning is truly inspiring. We appreciate your dedication and hope the feedback you received will be invaluable on your journey to success. Remember, every mock interview is a step closer to achieving your dreams. Embrace each opportunity to learn and grow. Stay motivated, believe in yourself, and keep pushing forward. You've got this!</p>               
                  <button className='Re-InterviewButton'>Re-Interview</button>
                </div>
              </div>
            </div>
        </div>
    );
}

export default App;