import React, { useRef, useState, useEffect } from 'react';

import './App.css';

function App() {
  const [showMcVideo, setShowMcVideo] = useState(false);
  const backgroundVideoRef = useRef(null);
  const [pause, setPause] = useState(false);
  const [pauseBg, setPauseBg] = useState(false);
  const [videoId, setVideoId] = useState('');
  const mcVideoRef = useRef(null);
  const [base64Video, setBase64Video] = useState(null);
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
    const fetchVideoData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:6123/get_video_base64', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoId }),
        });

        const data = await response.json();
        setBase64Video(data.base64Video);

      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchVideoData();
  }, [videoId]);
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
      <p>{videoId}</p>
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
            src={base64Video?`data:video/mp4;base64,${base64Video}`:'mc.mp4'}
          ></video>
        )}
      </div>

    </div>
  );
}

export default App;



