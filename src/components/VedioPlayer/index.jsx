import React, { useState, useRef } from 'react';
import './index.css'; // Import your CSS file for styling

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    loadVideo(file);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    loadVideo(file);
  };

  const loadVideo = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const videoUrl = e.target.result;
      videoRef.current.src = videoUrl;
      videoRef.current.play();
      setIsPlaying(true);
    };
    reader.readAsDataURL(file);
  };

  const handlePlayPauseClick = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="video-player-container">
      <div
        className="video-player"
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <video
          ref={videoRef}
          onClick={handlePlayPauseClick}
          className="video"
        ></video>
        <div className="overlay">
          {isPlaying ? (
            <button className="pause-btn" onClick={handlePlayPauseClick}>
              Pause
            </button>
          ) : (
            <button className="play-btn" onClick={handlePlayPauseClick}>
              Play
            </button>
          )}
        </div>
      </div>
      <input
        type="file"
        accept="video/*"
        onChange={handleUpload}
        className="upload-btn"
      />
    </div>
  );
};

export default VideoPlayer;
