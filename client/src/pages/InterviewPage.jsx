import React, { useState, useContext, useEffect } from 'react';
import '../css/InterviewPage.css';
import FaceRecognition from '../components/FaceRecognition';
import { Bs1CircleFill, Bs2CircleFill,Bs3CircleFill, Bs4CircleFill, Bs5CircleFill } from "react-icons/bs";
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/utils/toastStyle';
import { GlobalContext } from '../components/utils/GlobalState';
import AnswerQuestion from '../components/AnswerQuestion;';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function InterviewPage() {

    // access global values
    const { gJobTitle, gQtns } = useContext(GlobalContext);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [skippedQuestions, setSkippedQuestions] = useState([]);
    const [nextQuestions, setNextQuestions] = useState([]);
    const [toastOn, setToastOn] = useState(false);
    const [ recordAttempted, setRecordAttempted] = useState(false);
    const {
        transcript,
        listening,
        resetTranscript,
        isMicrophoneAvailable,
        browserSupportsSpeechRecognition,
        browserSupportsContinuousListening
    } = useSpeechRecognition();

    const handleSkipQuestion = () => {
        resetTranscript()
        if (questionNumber < 5) {
            setSkippedQuestions(prevState => [...prevState, questionNumber]);
            setQuestionNumber(prev => prev + 1);
        } else {
          toast.error("You've reached the last question.", {...toastErrorStyle(),autoClose: 2000});
        }
      };

    const handleNextQuestion = (questionNumber) => {
        resetTranscript()
        if(questionNumber < 5){
            setNextQuestions(prevState => [...prevState, questionNumber]);
            setQuestionNumber(prev => prev + 1);
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
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
        } else {
            SpeechRecognition.startListening();
        }
    }

    function handleStopListen() {
        SpeechRecognition.stopListening();
        if(transcript.length === 0) {
        !toastOn&& toast.error("Please can u repeat again!", {...toastErrorStyle(), autoClose: 1500 });
        setToastOn(true);
        }
    }
    // ======================================================================

  return (
    <div className='interview-div'>
        <div className='videoDisplay-div'>
            <FaceRecognition/>
        </div>
        <div className='questionDisplay-div'>
            <div className='questionNumber-div'>
            {/* <Bs1CircleFill className={`numberIcon ${questionNumber === 1 ? 'active' : ''}`} /> */}
            <Bs1CircleFill className={`numberIcon ${skippedQuestions.includes(1) ? 'skipped' : ''} ${questionNumber === 1 ? 'active' : ''} ${nextQuestions.includes(1) ? 'next' : ''}`} />
        --------------
        <Bs2CircleFill className={`numberIcon ${skippedQuestions.includes(2) ? 'skipped' : ''} ${questionNumber === 2 ? 'active' : ''} ${nextQuestions.includes(2) ? 'next' : ''}`} />
        --------------
        <Bs3CircleFill className={`numberIcon ${skippedQuestions.includes(3) ? 'skipped' : ''} ${questionNumber === 3 ? 'active' : ''} ${nextQuestions.includes(3) ? 'next' : ''}`}  />
        --------------
        <Bs4CircleFill className={`numberIcon ${skippedQuestions.includes(4) ? 'skipped' : ''} ${questionNumber === 4 ? 'active' : ''} ${nextQuestions.includes(4) ? 'next' : ''}`} />
        --------------
        <Bs5CircleFill className={`numberIcon ${skippedQuestions.includes(5) ? 'skipped' : ''} ${questionNumber === 5 ? 'active' : ''} ${nextQuestions.includes(5) ? 'next' : ''}`}  />
            </div>
            <h3>Question {currentQuestionIndex + 1}</h3>
            <p>{gQtns[currentQuestionIndex]}</p>
        </div>
        
        <div className='answerDisplay-div'>
            {transcript}
        </div>
        <div className='buttonDisplay-div'>
            <button className='Re-recordAnswerButton'  onClick={handleStartListen} disabled={toastOn || listening}>
                { listening ? <>Listening <FontAwesomeIcon icon={faSpinner} spin /></> : 
                transcript.length !==0 ? 'Re-record' : 'Answer'}
            </button>
            { listening && <button className='stopButton' onClick={handleStopListen}>Stop</button> }
            { !listening? !recordAttempted?
                <button className={`skipButton ${questionNumber === 5 ? 'hidden' : ''}`} onClick={handleSkipQuestion}>Skip</button> :
                <>
                    {transcript.length > 0?
                        <>
                            <button className={`skipButton ${questionNumber === 5 ? 'hidden' : ''}`} onClick={handleSkipQuestion}>Skip</button>
                            <button className={`nextButton ${questionNumber === 5 ? 'hidden' : ''}`} onClick={() => handleNextQuestion(questionNumber)}>
                                Next
                            </button>
                        </>
                        : <button className={`skipButton ${questionNumber === 5 ? 'hidden' : ''}`} onClick={handleSkipQuestion}>Skip</button>
                    }
                </>
               : null
            }
            { !listening &&
                <button className={`SubmitButton ${questionNumber === 5 ? 'display' : ''}`}>Submit</button> 
            }
        </div>
        {/* <AnswerQuestion /> */}
    </div>
  );
}

export default InterviewPage;
