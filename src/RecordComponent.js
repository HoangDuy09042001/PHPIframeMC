import React, { useRef, useEffect, useState } from 'react';
import RecordRTC from 'recordrtc';

const CanvasRecordComponent = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  console.log('Welcome to React')
  useEffect(() => {
    const canvas = canvasRef.current;
    console.log('Canvas')
    // Ensure the canvas is supported and the context is 2d
    if (canvas && canvas.getContext) {
      const context = canvas.getContext('2d');
      context.fillStyle = 'green';
      context.fillRect(10, 10, 50, 50);
    }
  }, []);
  
  const startRecording = async () => {
    console.log('startRecord')
    try {
      const canvas = canvasRef.current;

      if (canvas && canvas.captureStream) {
        const stream = canvas.captureStream();
        const rtcRecorder = RecordRTC(stream, {
          type: 'video',
          mimeType: 'video/webm',
        });

        rtcRecorder.startRecording();
        setRecorder(rtcRecorder);
        setRecording(true);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    console.log('stopRecord')
    if (recorder) {
      console.log('Hello2')
      recorder.stopRecording(() => {
        console.log('Hello3')
        const blob = recorder.getBlob();
        console.log(blob)
        const blobUrl = URL.createObjectURL(blob);
        videoRef.current.src = blobUrl;

        setRecording(false);
        setRecorder(null);
      });
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} width="200" height="200" style={{ border: '1px solid black' }}></canvas>
      <br />
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
      <br />
      <video ref={videoRef} width="200" height="200" controls></video>
    </div>
  );
};

export default CanvasRecordComponent;
