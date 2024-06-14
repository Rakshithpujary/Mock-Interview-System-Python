import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { toastErrorStyle } from './utils/toastStyle';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const AnswerQuestion = () => {
  const [toastOn, setToastOn] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    isMicrophoneAvailable,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening
  } = useSpeechRecognition();

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

  // function handle

  return (
    <div>
      <button onClick={handleStartListen} disabled={toastOn || listening}>
        { listening ? <>Recording <FontAwesomeIcon icon={faSpinner} spin /></>: transcript.length !==0 ? 'Re-record' : 'Answer'}
      </button>
      <button disabled={!listening} onClick={handleStopListen}>Stop</button>
      <p>{transcript}</p>
    </div>
  );
};

export default AnswerQuestion;