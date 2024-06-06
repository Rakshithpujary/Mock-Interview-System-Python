import React, { useRef, useEffect } from 'react';
import { useFaceDetection } from 'react-use-face-detection';
import Webcam from 'react-webcam';

function FaceRecognition() {
  const { boundingBox, isLoading, detected, facesDetected, webcamRef } = useFaceDetection();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const captureFrame = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current.video;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Here you can access the captured frame data from the canvas
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        console.log('Captured frame:', imageData);
      }
    };

    const intervalId = setInterval(captureFrame, 1000); // Capture frame every second

    return () => clearInterval(intervalId);
  }, []);

  const adjustResolution = (width, height) => {
    // Check if resolution is greater than 720p
    if (width > 1280 || height > 720) {
      return { width: 1280, height: 720 }; // Adjust resolution to 720p
    }
    return { width, height }; // Keep original resolution
  };

  return (
    <div>
      <h1>Face Recognition</h1>
      <Webcam
        mirrored={true}
        ref={(video) => {
          webcamRef.current = video;
          videoRef.current = video;
        }}
        width={1280} // Set initial width to 1280 (optional)
        height={720} // Set initial height to 720 (optional)
        videoConstraints={{ // Set video constraints to ensure resolution does not exceed 720p
          ...webcamRef.current?.props.videoConstraints,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }}
      />
      {isLoading ? (
        <p>Loading face detection model...</p>
      ) : detected ? (
        <p>{facesDetected} face(s) detected</p>
      ) : (
        <p>No faces detected</p>
      )}
      {/* Display the user's face */}
      {detected && (
        <div
          style={{
            position: 'absolute',
            border: '2px solid red',
            left: boundingBox[0],
            top: boundingBox[1],
            width: boundingBox[2],
            height: boundingBox[3],
          }}
        ></div>
      )}
      {/* Canvas for capturing frames */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      ></canvas>
    </div>
  );
}

export default FaceRecognition;