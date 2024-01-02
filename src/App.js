import React, { useRef, useState, useEffect } from 'react';

import './App.css';

function App() {
  const [showMcVideo, setShowMcVideo] = useState(false);
  const backgroundVideoRef = useRef(null);
  const [pause, setPause] = useState(false);
  const [pauseBg, setPauseBg] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const mcVideoRef = useRef(null);
  const handleBackgroundTimeUpdate = () => {
    const currentTime = backgroundVideoRef.current.currentTime;
    // Show the mc video after 6 seconds
    if (currentTime >= 6 && !showMcVideo) {
      setShowMcVideo(true);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('videoId');
    console.log(idFromUrl)
    if (idFromUrl) {
      setVideoId(idFromUrl);
    }
  }, []);
  useEffect(() => {
    const handleUserInteraction = () => {
      if (showMcVideo) {
  
        if (!pause) {
          mcVideoRef.current.pause();
        } else if (pause) {
          mcVideoRef.current.play();
        }
        setPause(!pause)
      }
      if (!showMcVideo) {
        if (!pauseBg) {
         
          backgroundVideoRef.current.play();
        } else if (pauseBg) {
          backgroundVideoRef.current.pause();
        }
        setPauseBg(!pauseBg)
      }
    };
    document.addEventListener('click', handleUserInteraction);


    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [pause, pauseBg, showMcVideo]);



  return (
    <div className="App" style={{ position: 'relative', width: 'fit-content', margin: 'auto' }}>
      <div className="container">
        <video
          className="background"
          preload="auto"
          width='calc(1920/2)'
          // controls={false}
          autoPlay
          onTimeUpdate={handleBackgroundTimeUpdate}
          ref={backgroundVideoRef}
          style={{ marginTop: '10px' }}
          src="background.mp4"
        ></video>

        {showMcVideo && (
          <video
            className="mc"
            width='380'
            // controls={false}
            autoPlay
            style={{
              position: 'absolute', top: '150px', left: '620px', borderRadius: '10px', transform: 'scale(1)',
              transition: 'transform 1s ease-in-out',
            }}
            ref={mcVideoRef}
            // src={base64Video?`data:video/mp4;base64,${base64Video}`:'mc.mp4'}
            src={videoId?`https://work247.vn/dowload/video_new/new_${videoId}/video_${videoId}.mp4`:'mc.mp4'}
          ></video>
        )}
      </div>

    </div>
  );
}

export default App;



