import React, { useRef, useEffect } from 'react';
import * as handTrack from 'handtrackjs';

const WebcamComponent = ({handleVideo}) => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          const modelParams = {
            flipHorizontal: true,
            maxNumBoxes: 1,
            iouThreshold: 0.5,
            scoreThreshold: 0.79,
          };
          modelRef.current = await handTrack.load(modelParams);
          console.log('Model loaded');
          
          handTrack.startVideo(videoRef.current).then(() => {
            console.log("Video started");
            runDetection();
          });
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    startVideo();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (modelRef.current) {
        modelRef.current.stopVideo();
      }
    };
  }, []);

  const runDetection = () => {
    if (videoRef.current) {
      modelRef.current.detect(videoRef.current).then((predictions) => {
        console.log("Predictions: ", predictions);
        handleVideo(predictions?.[0]?.label);
        if (videoRef.current) {
          requestAnimationFrame(runDetection);
        }
      });
    }
  };

  return (
    <div className="webcam">
      <video className="webcamVideo" ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default WebcamComponent;
