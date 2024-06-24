import React, { useRef, useEffect, useState, useContext } from 'react';
import { detectAllFaces, SsdMobilenetv1Options, TinyFaceDetectorOptions, nets } from 'face-api.js';
import { toast } from 'react-toastify';
import { toastErrorStyle } from './utils/toastStyle';
import '../css/FaceRecognition.css';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './utils/GlobalState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const FaceRecognition = () => {
  // access global values and functions
  const { setGSuspiciousCount, setGEmotionData } = useContext(GlobalContext);

  const [mediaStream, setMediaStream] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBorderAnimation, setShowBorderAnimation] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const intervalIdRef = useRef(null);
  
  let webCamToastDisplayedOnce = false;
  let tempEmotionData = null;
  let emotionDataCount = 1;
  let toastDisplayed = false;

  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      const MODEL_URL = '/face_models';
      // await nets.tinyFaceDetector.loadFromUri(MODEL_URL); // lighter detector model
      await nets.ssdMobilenetv1.loadFromUri(MODEL_URL); // heavier model
      // await nets.faceLandmark68Net.loadFromUri(MODEL_URL); // heavier landmark model
      await nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL); // Load the lighter landmark model
      await nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await nets.faceExpressionNet.loadFromUri(MODEL_URL);

      startVideo();
      setIsLoading(false);
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
          webCamToastDisplayedOnce = false; // not necassary
          setMediaStream(stream);
        })
        .catch(err => {
          !webCamToastDisplayedOnce && toast.error("Error accessing webcam, Please try giving permission.", 
            { ...toastErrorStyle(), autoClose: false });
          console.error('Error accessing webcam:', err);
          webCamToastDisplayedOnce = true;

          navigate('/', { replace: true }); // redirect to home page
        });
    };

    loadModels();
  }, []);

  // stop camera when component unmounts
  useEffect(()=>{
    return() =>{
      if(mediaStream?.getTracks) {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  },[mediaStream]);

  // stop camera interval after component unmounts
  useEffect(()=>{
    return ()=>{
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    }
  },[intervalIdRef])

  const handleVideoPlay = () => {
    const video = videoRef.current;
    const id = setInterval(async () => {
      const detections = await 
        // detectAllFaces(video, new TinyFaceDetectorOptions()) // lighter model
        detectAllFaces(video, new SsdMobilenetv1Options()) // heavier model
        .withFaceLandmarks(true)
        .withFaceExpressions()

      if (!toastDisplayed) {
        if (detections.length === 0) {
          toast.error("No face detected!", { ...toastErrorStyle(), autoClose: 1800, onClose: () => toastDisplayed = false });
          // setToastDisplayed(true);
          toastDisplayed = true;
          setShowBorderAnimation(true);
          setGSuspiciousCount(prev => prev + 1);
        } else if (detections.length > 1) {
          toast.error("Multiple faces have been detected", { ...toastErrorStyle(), autoClose: 1800, onClose: () => toastDisplayed = false });
          // setToastDisplayed(true);
          toastDisplayed = true;
          setShowBorderAnimation(true);
          setGSuspiciousCount(prev => prev + 1);
        }else{
          setShowBorderAnimation(false);
        }
      }

      if(detections.length === 1) {
        const currentE = detections[0]?.expressions;
        if(tempEmotionData === null) {
          const initialData = {
            angry: currentE.angry * 10,
            disgusted: currentE.disgusted * 10,
            fearful: currentE.fearful * 10,
            happy: currentE.happy * 10,
            neutral: currentE.neutral * 10,
            sad: currentE.sad * 10,
            surprised: currentE.surprised * 10,
          };

          tempEmotionData = initialData;
        }
        else {
          // Calculate average emotions from previous data and new data
          const avgE = {
            angry: calculateAverage(tempEmotionData.angry, currentE.angry),
            disgusted: calculateAverage(tempEmotionData.disgusted, currentE.disgusted),
            fearful: calculateAverage(tempEmotionData.fearful, currentE.fearful),
            happy: calculateAverage(tempEmotionData.happy, currentE.happy),
            neutral: calculateAverage(tempEmotionData.neutral, currentE.neutral),
            sad: calculateAverage(tempEmotionData.sad, currentE.sad),
            surprised: calculateAverage(tempEmotionData.surprised, currentE.surprised),
          };

          tempEmotionData = avgE;
          emotionDataCount += 1; // not necassary in above if-condition

          // set global emotion data for later access
          if(emotionDataCount>15)
            setGEmotionData(tempEmotionData);
        }
      }
    }, 1000);

    // Clear the previous interval if it exists
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);

    // Set the new interval ID
    intervalIdRef.current = id;
    return () => clearInterval(id); // not working
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
    <div className='face-recognition-main'>
      { isLoading ?
          <FontAwesomeIcon icon={faSpinner} spin size="5x" />
        :
          <div className='video-container'>
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{
                position: 'relative',
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
              onPlay={handleVideoPlay}
            />
          </div>
      }
      <div className={`border_box ${showBorderAnimation ? 'show' : ''}`}>
          <span className="line line01"></span>
          <span className="line line02"></span>
          <span className="line line03"></span>
          <span className="line line04"></span>
      </div>
    </div>
  );
};

export default FaceRecognition;