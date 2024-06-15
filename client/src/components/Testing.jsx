import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { toast } from 'react-toastify';
import { toastErrorStyle } from './utils/toastStyle';
import '../css/FaceRecognition.css';

const Testing = () => {
  const videoRef = useRef(null);
  const [capturedFrames, setCapturedFrames] = useState([]);
  // const [toastDisplayed, setToastDisplayed] = useState(false);
  const [showBorderAnimation, setShowBorderAnimation] = useState(false);

  let toastDisplayed = false;

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/face_models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(err => {
          console.error('Error accessing webcam:', err);
        });
    };

    loadModels();
  }, []);

  const handleVideoPlay = () => {
    const video = videoRef.current;
    const displaySize = { width: video.width, height: video.height };

    const interval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const canvas = faceapi.createCanvasFromMedia(video);
      faceapi.matchDimensions(canvas, displaySize);

      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      if (!toastDisplayed) {
        if (detections.length === 0) {
          toast.error("No face detected!", { ...toastErrorStyle(), autoClose: 2500, onClose: () => toastDisplayed = false });
          // setToastDisplayed(true);
          toastDisplayed = true;
          setShowBorderAnimation(true);
        } else if (detections.length > 1) {
          toast.error("Multiple faces have been detected", { ...toastErrorStyle(), autoClose: 2500, onClose: () => toastDisplayed = false });
          // setToastDisplayed(true);
          toastDisplayed = true;
          setShowBorderAnimation(true);
        }else{
          setShowBorderAnimation(false);
        }
      }

    }, 100);

    return () => clearInterval(interval);
  };

  const takeScreenshot = () => {
    const video = videoRef.current;
    const scale = 0.5; // Adjust this value to reduce the size of the screenshot
    const canvas = document.createElement('canvas');
    canvas.width = video.width * scale;
    canvas.height = video.height * scale;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    setCapturedFrames(prevFrames => [...prevFrames, dataURL]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .then(detections => {
            if (detections.length === 1) {
              takeScreenshot();
            }
          });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
          <span class="line line01"></span>
          <span class="line line02"></span>
          <span class="line line03"></span>
          <span class="line line04"></span>
      </div>
    </div>
  );
};

export default Testing;