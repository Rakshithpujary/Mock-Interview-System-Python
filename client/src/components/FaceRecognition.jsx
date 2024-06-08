import React, { useState, useEffect, useRef, useContext } from 'react';
import Webcam from 'react-webcam';
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import * as FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { toast } from 'react-toastify';
import { toastErrorStyle } from './utils/toastStyle';
import { GlobalContext } from './utils/GlobalState';

const width = 500;
const height = 500;

const WebcamDemo = () => {

  // const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
  // console.log(globalVariable);

  const [capturedFrames, setCapturedFrames] = useState([]);
  const intervalIdRef = useRef(null);
  const [toastDisplayed, setToastDisplayed] = useState(false);

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

  useEffect(() => {
    if (!isLoading && !toastDisplayed) {
      if (Number(facesDetected) === 0) {
        toast.error("No face detected!", { ...toastErrorStyle(), autoClose: 2500, onClose: () => setToastDisplayed(false) });
        setToastDisplayed(true);
      } else if (Number(facesDetected) > 1) {
        toast.error("Multiple faces have been detected", { ...toastErrorStyle(), autoClose: 2500, onClose: () => setToastDisplayed(false) });
        setToastDisplayed(true);
      }
    }
  }, [facesDetected, webcamRef, toastDisplayed]);

  useEffect(() => {
    // Start capturing frames every 20 seconds
    intervalIdRef.current = setInterval(() => {
      if (webcamRef.current) {
        if((Number(facesDetected)) === 1) {
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
      <h1>Face Recognition</h1>
      <p>{`Loading: ${isLoading}`}</p>
      <p>{`Face Detected: ${detected}`}</p>
      <p>{`Number of faces detected: ${facesDetected}`}</p>
      <Webcam
        ref={webcamRef}
        forceScreenshotSourceSize
        style={{
          height,
          width,
          position: 'absolute',
        }}
      />
      <div>
        <h2>Captured Frames</h2>
        {capturedFrames.map((frame, index) => (
          <img key={index} src={frame} alt={`Captured frame ${index + 1}`} style={{ width: '100px', margin: '10px' }} />
        ))}
      </div>
    </div>
  );
};

export default WebcamDemo;