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
  const { gJobRole, gQtns, gAns, gEmotionData, gValidReview } = useContext(GlobalContext);

  const [validUpdated, setValidUpdated] = useState(false);
  const [ review, setReview] = useState('');

  const navigate = useNavigate();

  // check if valid entry to review page
  useEffect(()=>{
    if(gValidReview !== null) { // to make sure that it only runs once
        setValidUpdated(true);
    }
    if(gValidReview === false) {
        window.location.replace('/'); // Re-direct to home page
    }
  },[gValidReview]);


  // call getReview
  useEffect(()=>{
    getReview();
  },[gEmotionData]); // call when emotion data is loaded, then rest variables are assumed loaded

  const getReview = async () => {
    if(gEmotionData === null) return; // extra validation
    if(review !== '') return; // extra validation

    try {
      const response = await axios.post('http://localhost:5000/api/get-review', {
          job_role: gJobRole,
          qns: gQtns,
          ans: gAns,
          emotion: gEmotionData,
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
           <Markdown>{review}</Markdown>
        </div>
    );
}

export default App;