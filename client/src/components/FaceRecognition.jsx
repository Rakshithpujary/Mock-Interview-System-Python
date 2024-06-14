import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import * as FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { toast } from 'react-toastify';
import { toastErrorStyle } from './utils/toastStyle';
import '../css/FaceRecognition.css';
import PageVisibility from './utils/PageVisibility';

const width = 350;
const height = 350;

const FaceRecognition = () => {
  const [capturedFrames, setCapturedFrames] = useState([]);
  const intervalIdRef = useRef(null);
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [showBorderAnimation, setShowBorderAnimation] = useState(false);
  const isPageVisible = PageVisibility();

  const { webcamRef, isLoading, detected, facesDetected } = useFaceDetection({
    faceDetectionOptions: {
      model: 'short',
    },
    faceDetection: new FaceDetection.FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    }),
    camera: ({ mediaSrc, onFrame }: CameraOptions) =>
      new Camera(mediaSrc, {
        onFrame,
        width,
        height,
      }),
  });

  // when component unmounts, reload to stop camera process
  useEffect(()=> {
    return () => {
        if(webcamRef.current === null) {
          window.location.reload();
        }
    }
  },[webcamRef])

  useEffect(() => {
    if (!isPageVisible) {
    }
  }, [isPageVisible]);

  useEffect(() => {
    if (!isLoading && !toastDisplayed) {
      if (Number(facesDetected) === 0) {
        toast.error("No face detected!", { ...toastErrorStyle(), autoClose: 2500, onClose: () => setToastDisplayed(false) });
        setToastDisplayed(true);
        setShowBorderAnimation(true);
      } else if (Number(facesDetected) > 1) {
        toast.error("Multiple faces have been detected", { ...toastErrorStyle(), autoClose: 2500, onClose: () => setToastDisplayed(false) });
        setToastDisplayed(true);
        setShowBorderAnimation(true);
      }else{
        setShowBorderAnimation(false);
      }
    }
  }, [facesDetected, webcamRef, isLoading, toastDisplayed]);

  useEffect(() => {
    // Start capturing frames every 3 seconds
    intervalIdRef.current = setInterval(() => {
      if (webcamRef.current) {
        if (Number(facesDetected) === 1) {
          const screenshot = webcamRef.current.getScreenshot();
          if (screenshot) {
            setCapturedFrames(prevFrames => [...prevFrames, screenshot]);
          }
        }
      }
    }, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalIdRef.current);
  }, [webcamRef, facesDetected]);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        forceScreenshotSourceSize
        style={{
          height,
          width,
          position: 'relative',
          borderRadius: '5px'
          
        }}
      />
      <div className={`border_box ${showBorderAnimation ? 'show' : ''}`}>
        <span class="line line01"></span>
        <span class="line line02"></span>
        <span class="line line03"></span>
        <span class="line line04"></span>
    </div>
      
    </div>
  );
};

export default FaceRecognition;