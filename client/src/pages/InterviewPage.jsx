import React, { useState, useContext, useEffect } from 'react';
import '../css/InterviewPage.css';
import FaceRecognition from '../components/FaceRecognition';
import { Bs1CircleFill, Bs2CircleFill,Bs3CircleFill, Bs4CircleFill, Bs5CircleFill } from "react-icons/bs";
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/utils/toastStyle';
import { GlobalContext } from '../components/utils/GlobalState';
function InterviewPage() {

    // access global values
    const { gJobTitle, gQtns } = useContext(GlobalContext);
    
    const [questionNumber, setQuestionNumber] = useState(1);

    // const handleClickSkip = () => {
    //     if (questionNumber < 5) {
    //       setQuestionNumber(prev => prev + 1);
    //     } else {
    //       toast.error("You've reached the last question.", {...toastErrorStyle(),autoClose: 2000});
    //     }
    //   };

        const [skippedQuestions, setSkippedQuestions] = useState([]);

        const handleSkipQuestion = (questionNumber) => {
            setSkippedQuestions(prevState => [...prevState, questionNumber]);
            setQuestionNumber(prev => prev + 1);
        };

  return (
    <div className='interview-div'>
        <div className='videoDisplay-div'>
            <FaceRecognition/>
        </div>
        <div className='questionDisplay-div'>
            <div className='questionNumber-div'>
            {/* <Bs1CircleFill className={`numberIcon ${questionNumber === 1 ? 'active' : ''}`} /> */}
            <Bs1CircleFill className={`numberIcon ${skippedQuestions.includes(1) ? 'skipped' : ''} ${questionNumber === 1 ? 'active' : ''}`} />
        --------------
        <Bs2CircleFill className={`numberIcon ${skippedQuestions.includes(2) ? 'skipped' : ''} ${questionNumber === 2 ? 'active' : ''}`} />
        --------------
        <Bs3CircleFill className={`numberIcon ${skippedQuestions.includes(3) ? 'skipped' : ''} ${questionNumber === 3 ? 'active' : ''}`}  />
        --------------
        <Bs4CircleFill className={`numberIcon ${skippedQuestions.includes(4) ? 'skipped' : ''} ${questionNumber === 4 ? 'active' : ''}`} />
        --------------
        <Bs5CircleFill className={`numberIcon ${skippedQuestions.includes(5) ? 'skipped' : ''} ${questionNumber === 5 ? 'active' : ''}`}  />
            </div>
            Question...........
        </div>
        
        <div className='answerDisplay-div'>
            Answer............
        </div>
        <div className='buttonDisplay-div'>
            <button className='AnsawerNowButton'>Record now</button>
            <button className='ReRecordButton'>Re-record</button>
            <button className='SkipNextButton'onClick={() => handleSkipQuestion(questionNumber)} >Skip / Next</button>
            <button className='SubmitButton'>Submit</button>
        </div>
    
    </div>
  );
}

export default InterviewPage;
