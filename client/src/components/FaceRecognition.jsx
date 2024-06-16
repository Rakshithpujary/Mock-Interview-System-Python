import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { toast } from 'react-toastify';
import { toastErrorStyle } from './utils/toastStyle';
import '../css/FaceRecognition.css';
import { useNavigate } from 'react-router-dom';

const Testing = () => {
  const [ mediaStream, setMediaStream] = useState(null);
  const [ showBorderAnimation, setShowBorderAnimation] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const intervalIdRef = useRef(null);
  
  let componentMounted = false;
  let webCamToastDisplayedOnce = false;
  let emotionData = null;
  let toastDisplayed = false;

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/face_models';
      // await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL); // lighter detector model
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL); // heavier model
      // await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL); // heavier landmark model
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL); // Load the lighter landmark model
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      setTimeout(()=>{
        startVideo(); // start after 1.5 sec delay
      },1500);

    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
          webCamToastDisplayedOnce = false; // not necassary
          setMediaStream(stream);
        })
        .catch(err => {
          !webCamToastDisplayedOnce && toast.error("Error accessing webcam", { ...toastErrorStyle(), autoClose: false });
          console.error('Error accessing webcam:', err);
          webCamToastDisplayedOnce = true;

          // redirect to home page
          navigate('/', { replace: true });
        });
    };

    loadModels();
  }, []);

  // stop camera when component unmounts
  useEffect(()=>{
    return() =>{
      if(mediaStream?.getTracks) {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop())
      }
    }
  },[mediaStream]);
 
  const handleVideoPlay = () => {
    const video = videoRef.current;
    const id = setInterval(async () => {
      const detections = await faceapi
        // .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()) // lighter model
        .detectAllFaces(video, new faceapi.SsdMobilenetv1Options()) // heavier model
        .withFaceLandmarks(true)
        .withFaceExpressions()

      if (!toastDisplayed) {
        if (detections.length === 0) {
          toast.error("No face detected!", { ...toastErrorStyle(), autoClose: 1800, onClose: () => toastDisplayed = false });
          // setToastDisplayed(true);
          toastDisplayed = true;
          setShowBorderAnimation(true);
        } else if (detections.length > 1) {
          toast.error("Multiple faces have been detected", { ...toastErrorStyle(), autoClose: 1800, onClose: () => toastDisplayed = false });
          // setToastDisplayed(true);
          toastDisplayed = true;
          setShowBorderAnimation(true);
        }else{
          setShowBorderAnimation(false);
        }
      }

      if(detections.length === 1) {
        const currentE = detections[0]?.expressions;
        if(emotionData === null) {
          const initialData = {
            angry: currentE.angry * 10,
            disgusted: currentE.disgusted * 10,
            fearful: currentE.fearful * 10,
            happy: currentE.happy * 10,
            neutral: currentE.neutral * 10,
            sad: currentE.sad * 10,
            surprised: currentE.surprised * 10,
          };

          emotionData = initialData;
        }
        else {
          // Calculate average emotions from previous data and new data
          const avgE = {
            angry: calculateAverage(emotionData.angry, currentE.angry),
            disgusted: calculateAverage(emotionData.disgusted, currentE.disgusted),
            fearful: calculateAverage(emotionData.fearful, currentE.fearful),
            happy: calculateAverage(emotionData.happy, currentE.happy),
            neutral: calculateAverage(emotionData.neutral, currentE.neutral),
            sad: calculateAverage(emotionData.sad, currentE.sad),
            surprised: calculateAverage(emotionData.surprised, currentE.surprised),
          };

          emotionData = avgE;
        }
      }
    }, 1000);

    intervalIdRef.current = id;
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  function calculateAverage(emotionDataValue, currentEValue) {
    // Parse values to ensure they are numeric, default to 0 if not
    const parsedEmotionData = parseFloat(emotionDataValue) || 0;
    const parsedCurrentE = parseFloat(currentEValue) || 0;
  
    // Calculate average
    const average = (parsedEmotionData + parsedCurrentE * 10) / 2;
  
    // Check if the result is numeric and then format it
    if (!isNaN(average) && isFinite(average)) {
      // Check if formatting is necessary based on the number of decimal places
      if (average % 1 !== 0) { // Check if there are any decimal places
        return average.toFixed(3);
      } else {
        return average.toFixed(0);
      }
    } else {
      return 0; // Handle the case where the result is NaN
    }
  }

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="350"
        height="350"
        style={{
          position: 'relative',
          borderRadius: '5px'
        }}
        onPlay={handleVideoPlay}
      />
      <div className={`border_box ${showBorderAnimation ? 'show' : ''}`}>
          <span className="line line01"></span>
          <span className="line line02"></span>
          <span className="line line03"></span>
          <span className="line line04"></span>
      </div>
    </div>
  );
};

export default Testing;