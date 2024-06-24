import React, { useState, useContext, useEffect, useRef } from 'react';
import '../css/InterviewPage.css';
import FaceRecognition from '../components/FaceRecognition';
import { Bs1CircleFill, Bs2CircleFill,Bs3CircleFill, Bs4CircleFill, Bs5CircleFill } from "react-icons/bs";
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/utils/toastStyle';
import { GlobalContext } from '../components/utils/GlobalState';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import PageVisibility from "../components/utils/PageVisibility";
import { useNavigate } from 'react-router-dom';
import { BiStopwatch } from 'react-icons/bi';

function InterviewPage() {
    // access global values and functions
    const { gQtns, setGAns, gValidInterview,
            setGValidInterview, setGSuspiciousCount, setGValidReview
          } = useContext(GlobalContext);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [skippedQuestions, setSkippedQuestions] = useState([]);
    const [nextQuestions, setNextQuestions] = useState([]);
    const [toastOn, setToastOn] = useState(false);
    const [recordAttempted, setRecordAttempted] = useState(false);
    const [timer, setTimer] = useState(['2', '00']);
    const [timerIntervalId, setTimerIntervalId] = useState(null);
    const [validUpdated, setValidUpdated] = useState(false);
    const [skipInTimer, setSkipInTimer] = useState(7); // 7 secs
    const [resetSkipInTimer, setResetSkipInTimer] = useState(false);
    const [skipDisabled, setSkipDisabled] = useState(false);
    const AnswerArray=useRef(new Array(5).fill(''));
    const isPageVisible = PageVisibility();
    const navigate = useNavigate();
    const {
        transcript,
        listening,
        resetTranscript,
        isMicrophoneAvailable,
        browserSupportsSpeechRecognition,
        browserSupportsContinuousListening
    } = useSpeechRecognition();

    // check if valid entry to interview page
    useEffect(()=>{
        if(gValidInterview !== null) { // to make sure that it only runs once
            setValidUpdated(true);
        }
        if(!validUpdated && gValidInterview === false) {
            window.location.replace('/'); // Re-direct to home page
        }
        setGValidInterview(false); // once entered, cannot enter again without generating qtns
    },[gValidInterview]);

    // if user changed tab or window
    useEffect(() => {
        if (!isPageVisible) {
            setGSuspiciousCount(prev => prev + 1);
        };
    }, [isPageVisible]);

    const handleSubmit = async () => {
        if(transcript.length>0)
        {
            AnswerArray.current[questionNumber-1]=transcript;

        }else{
            AnswerArray.current[questionNumber-1]='Skipped';
        }

        setGValidReview(true);
        setGAns(AnswerArray.current);

        navigate('/review', {replace : true});
    }

    // handle skip question timer
    useEffect(()=>{
        setSkipDisabled(true);
        setSkipInTimer(7); // 7 secs
        let temp = 6; // start from 1 sec less, to handle the delay in useState update
        const intervalId = setInterval(() => {
            if (temp <= 0) {
                setSkipDisabled(false);
                clearInterval(intervalId); // clear the interval once the timer hits 0
                return;
            }
            setSkipInTimer(temp);
            temp -= 1;
        }, 1000);
      
        return () => clearInterval(intervalId); // clear interval on cleanup
    },[resetSkipInTimer]);

    const handleSkipQuestion = () => {
        resetTranscript();
        setResetSkipInTimer(prev => !prev); // toggle value to call useEffect
        if (questionNumber < 5) {
            setSkippedQuestions(prevState => [...prevState, questionNumber]);
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setQuestionNumber(prev => prev + 1);
            AnswerArray.current[questionNumber-1]='Skipped';
        } else {
          toast.error("You've reached the last question.", {...toastErrorStyle(),autoClose: 2000});
        }
      };

    const handleNextQuestion = (questionNumber) => {
        resetTranscript();
        setResetSkipInTimer(prev => !prev); // toggle value to call useEffect
        if(questionNumber < 5){
            setNextQuestions(prevState => [...prevState, questionNumber]);
            setQuestionNumber(prev => prev + 1);
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            AnswerArray.current[questionNumber-1]=transcript;
        }
        else{
            toast.error("You've reached the last question.", {...toastErrorStyle(), autoClose: 2000});
        }
    };

    // answer stuff ==========================================================
    useEffect(() => {
        if (toastOn) {
            const timer = setTimeout(() => {
                setToastOn(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [toastOn]);

    // when component unmounts stop speech
    useEffect(()=>{
        return() =>{
            handleStopListen();
            resetTranscript(); // clear transcript
        }
    },[]);

    function handleStartListen() {
        if(transcript.length !== 0){
            resetTranscript()
        }
        if (!browserSupportsSpeechRecognition) {
            !toastOn&& toast.error("Please use a different browser to enable speech recognition", {...toastErrorStyle(), autoClose: 1500 });
            setToastOn(true);
            return;
        }
        if (!isMicrophoneAvailable) {
            !toastOn&& toast.error("Please allow microphone permission", {...toastErrorStyle(), autoClose: 1500 });
            setToastOn(true);
            return;
        }
        if (browserSupportsContinuousListening) {
            SpeechRecognition.startListening({ continuous: true });
            setRecordAttempted(true);

            const listenFor = 120000; // 120,000 milliseconds = 2 minutes

            // screen timer logic
            let tempMili = listenFor - 1000; // start from 1 sec less, to handle the delay in useState update
            const id = setInterval(()=>{
                updateScreenTimer(tempMili);
                tempMili -= 1000;

                // Stop the timerInterval when time is up
                if (tempMili <= 0) {
                    clearInterval(id);
                    return;
                }
            },1000);   
            setTimerIntervalId(id);

            // Stop listening after 2 minutes
            setTimeout(() => {
                handleStopListen();
            }, listenFor); 

        } else {
            setRecordAttempted(true);
            SpeechRecognition.startListening();
        }
    }

    function handleStopListen() {
        SpeechRecognition.stopListening();
        setTimer(['2', '00']); // reset screen timer
        if (timerIntervalId) clearInterval(timerIntervalId);
    }

    function updateScreenTimer(ms) {
        // Convert milliseconds to seconds and minutes
        let seconds = Math.floor(ms / 1000); // Total seconds
        let minutes = Math.floor(seconds / 60); // Total minutes
        seconds = seconds % 60; // Remaining seconds after converting to minutes

        // Format seconds to add leading zero if it's a single digit
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        setTimer([minutes, seconds]);
      }
    // ======================================================================

  return (
    <div className='Main-interview-div'>
    <div className='interview-div'>
    
        <div className='videoDisplay-div'>
            <FaceRecognition />
        </div>
        <div className='questionDisplay-div'>
            <div className='questionNumber-div'>
                <div className='Number1-div'>
                    <Bs1CircleFill className={`numberIcon ${skippedQuestions.includes(1) ? 'skipped' : ''} ${questionNumber === 1 ? 'active' : ''} ${nextQuestions.includes(1) ? 'next' : ''}`} />
                </div>
                <div className='line-div'></div>
                <div className='Number2-div'>
                    <Bs2CircleFill className={`numberIcon ${skippedQuestions.includes(2) ? 'skipped' : ''} ${questionNumber === 2 ? 'active' : ''} ${nextQuestions.includes(2) ? 'next' : ''}`} />
                </div>
                <div className='line-div'></div>
                <div className='Number3-div'>
                    <Bs3CircleFill className={`numberIcon ${skippedQuestions.includes(3) ? 'skipped' : ''} ${questionNumber === 3 ? 'active' : ''} ${nextQuestions.includes(3) ? 'next' : ''}`}  />
                </div>
                <div className='line-div'></div>
                <div className='Number4-div'>
                    <Bs4CircleFill className={`numberIcon ${skippedQuestions.includes(4) ? 'skipped' : ''} ${questionNumber === 4 ? 'active' : ''} ${nextQuestions.includes(4) ? 'next' : ''}`} />
                </div>
                <div className='line-div'></div>
                <div className='Number5-div'>
                    <Bs5CircleFill className={`numberIcon ${skippedQuestions.includes(5) ? 'skipped' : ''} ${questionNumber === 5 ? 'active' : ''} ${nextQuestions.includes(5) ? 'next' : ''}`}  /> 
                </div>
            </div>
            <div className='question-div'>
                <h3>Question {currentQuestionIndex + 1}</h3>
                <p>{gQtns[currentQuestionIndex]}</p>
            </div>
        </div>
        
        <div className='answerDisplay-div'>
            {transcript.length >0 ? <div className='answer-transcript'>{transcript}</div> :
            <div className='placeholder-div'>Answer...</div>}
        </div>
        <div className='buttonDisplay-div'>
            <button className='Re-recordAnswerButton responsiveBtnTxt'  onClick={handleStartListen} disabled={toastOn || listening}>
                { listening ? <>Listening <FontAwesomeIcon icon={faSpinner} spin /></> : 
                transcript.length !==0 ? 'Re-record' : 'Answer'}
            </button>
            { listening && browserSupportsContinuousListening ?
                
                <div className='iconContainer-div'>
                    <BiStopwatch className='icon'/>
                    <p className='number'>{timer[0]}:{timer[1]}</p>
                </div> : null
            }
            { listening && <button className='stopButton responsiveBtnTxt' onClick={handleStopListen}>Stop</button> }
            { !listening? !recordAttempted?
                <button className={`skipButton responsiveBtnTxt ${questionNumber === 5 ? 'hidden1' : ''}`}
                 onClick={handleSkipQuestion} disabled={skipDisabled}>
                    {skipDisabled? `Skip in ${skipInTimer}s` : 'Skip'}
                </button> :
                <>
                    {transcript.length > 0?
                        <>
                            <button className={`skipButton responsiveBtnTxt ${questionNumber === 5 ? 'hidden1' : ''}`}
                            onClick={handleSkipQuestion} disabled={skipDisabled}>
                                {skipDisabled? `Skip in ${skipInTimer}s` : 'Skip'}
                            </button>
                            <button className={`nextButton responsiveBtnTxt ${questionNumber === 5 ? 'hidden1' : ''}`} onClick={() => handleNextQuestion(questionNumber)}>
                                Next
                            </button>
                        
                        </>
                        :
                        <button className={`skipButton responsiveBtnTxt ${questionNumber === 5 ? 'hidden1' : ''}`}
                            onClick={handleSkipQuestion} disabled={skipDisabled}>
                            {skipDisabled? `Skip in ${skipInTimer}s` : 'Skip'}
                        </button>
                    }
                </>
               : null
            }
            { !listening &&
                <button className={`SubmitButton responsiveBtnTxt ${questionNumber === 5 ? 'display' : ''}`}
                onClick={handleSubmit} disabled={skipDisabled}>{skipDisabled? `Submit in ${skipInTimer}s` : 'Submit'}</button> 
            }
        </div>
    </div>
    </div>
  );
}

export default InterviewPage;