import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { toastErrorStyle } from './utils/toastStyle';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Testing = () => {
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
    console.log(transcript.length)
    if(transcript.length === 0) {
      !toastOn&& toast.error("Please can u repeat again!", {...toastErrorStyle(), autoClose: 1500 });
      setToastOn(true);
    }
  }

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={handleStartListen} disabled={toastOn}>
        { listening ? <>Recording <FontAwesomeIcon icon={faSpinner} spin /></>: 'Answer'}
      </button>
      <button disabled={!listening} onClick={handleStopListen}>Stop</button>
      { !listening & transcript.length !==0 ? 
          <button onClick={resetTranscript}>Reset</button>
        : null
      }
      <p>{transcript}</p>
    </div>
  );
};
export default Testing;
