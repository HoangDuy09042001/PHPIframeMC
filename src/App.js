import React, { useRef, useState, useEffect } from 'react';

import './App.css';

function App() {
  const [showMcVideo, setShowMcVideo] = useState(false);
  const backgroundVideoRef = useRef(null);
  const audioRef = useRef(null);
  const [pause, setPause] = useState(false);
  const [imgdefault, setImgDefault] = useState(true);
  const [scale, setScale] = useState(1)
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [pauseBg, setPauseBg] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const mcVideoRef = useRef(null);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('videoId');
    const idWidth = urlParams.get('width');
    console.log(idFromUrl)
    if (idFromUrl) {
      setVideoId(idFromUrl);
    }
    if (idWidth) {
      setWidth(parseFloat(idWidth))
    }
  }, []);
  useEffect(() => {
    const handleUserInteraction = () => {
      if (showMcVideo) {

        if (!pause) {
          mcVideoRef.current.pause();
          audioRef.current.pause();
          audioRef.current.volume = 0.1
        } else if (pause) {
          mcVideoRef.current.play();
          audioRef.current.play();
          audioRef.current.volume = 0.1
        }
        setPause(!pause)
      }
      if (!showMcVideo) {
        if (!pauseBg) {

          backgroundVideoRef.current.play();
          audioRef.current.play();
          audioRef.current.volume = 0.1
        } else if (pauseBg) {
          backgroundVideoRef.current.pause();
          audioRef.current.pause();
          audioRef.current.volume = 0.1
        }
        setPauseBg(!pauseBg)
      }
    };
    const backgroundVideoRefButton = backgroundVideoRef.current
    backgroundVideoRefButton.addEventListener('click', handleUserInteraction);


    return () => {
      backgroundVideoRefButton.removeEventListener('click', handleUserInteraction);
    };
  }, [pause, pauseBg, showMcVideo]);

  useEffect(() => {
    setScale(width / 1920)
    setHeight(width / 1920 * 1080)
  }, [imgdefault, width]);

  return (
    <div className="App" style={{ position: 'relative', width: 'fit-content', margin: 'auto' }}>
      {imgdefault ? <div onClick={() => {
        setImgDefault(false)
        const backgroundVideoRefButton = backgroundVideoRef.current
        backgroundVideoRefButton.click()
      }} className='image-default' style={{ width: width + 'px', height: height + 'px' }}></div> : <></>}

      <audio ref={audioRef} src="background_music.mp3" />
      <div className="container" style={{ display: imgdefault ? 'none' : 'block' }}>
        <video
          className="background"
          preload="auto"
          autoPlay
          onTimeUpdate={() => {
            const currentTime = backgroundVideoRef.current.currentTime;
            if (currentTime >= 6 && !showMcVideo) {
              setShowMcVideo(true);
            }
          }}
          ref={backgroundVideoRef}
          width={width}
          src="background.mp4"
        ></video>

        {showMcVideo && (
          <div style={{ borderRadius: '10', overflow: 'hidden', width: 600 * scale + 'px', height: 600 * scale + 'px' }}>
            <video
              className="mc"
              autoPlay
              width={600 * scale}
              style={{ top: scale * (560 - 600 / 2) + 'px', left: scale * (1350 - 600 / 2) + 'px' }}
              ref={mcVideoRef}
              src={videoId ? `https://work247.vn/dowload/video_new/new_${videoId}/video_${videoId}.mp4` : 'mc.mp4'}
            ></video>
          </div>
        )}
      </div>


    </div>
  );
}

export default App;



