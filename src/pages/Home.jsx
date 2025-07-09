// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs';
import Header from '../components/Header';
import FeedbackOverlay from '../components/FeedbackOverlay';
import VideoUpload from '../components/VideoUpload';
import socket from '../sockets/socket';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader } from 'lucide-react';

const FRAME_INTERVAL = 100;

const Home = () => {
  const webcamRef = useRef(null);
  const uploadRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [useWebcam, setUseWebcam] = useState(true);
  const [mode, setMode] = useState('squat');
  const [isDetecting, setIsDetecting] = useState(false);
  const [statusText, setStatusText] = useState('Loading model...');
  const [posture, setPosture] = useState({ status: 'neutral', instructions: '' });
  const [scoreHistory, setScoreHistory] = useState([]);

  const detectionRef = useRef(false); // synced flag

  useEffect(() => {
    (async () => {
      await tf.setBackend('webgl');
      await tf.ready();
      const det = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: 'SinglePose.Lightning' }
      );
      setDetector(det);
      setStatusText('Model ready');
    })();
  }, []);

  useEffect(() => {
    socket.on('posture-feedback', ({ status, score, keypoints, instructions }) => {
      console.debug('Server feedback:', { status, score, instructions, keypoints: keypoints.length });
      setPosture({ status, instructions });
      setScoreHistory(prev => [...prev.slice(-29), { score }]);
      drawKeypoints(keypoints);
    });
    return () => socket.off('posture-feedback');
  }, []);

  useEffect(() => {
    if (useWebcam) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          webcamRef.current.srcObject = stream;
          setStatusText('Webcam active');
        })
        .catch(() => setStatusText('Webcam denied'));
    }
  }, [useWebcam]);

  const drawKeypoints = (kps) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = '#2563eb';
    kps.forEach(p => ctx.fillRect(p.x - 4, p.y - 4, 8, 8));
  };

  const analyze = async source => {
    if (!detector) return;
    const poses = await detector.estimatePoses(source);
    if (poses.length) {
      const kps = poses[0].keypoints.map(({ name, x, y }) => ({ name, x, y }));
      console.debug('Detected keypoints:', kps.map(p => p.name));
      socket.emit('frame', { keypoints: kps, mode });
    }
  };

  const startDetection = () => {
    if (!useWebcam && !uploadRef.current.src) {
      alert('Upload a video first!');
      return;
    }

    detectionRef.current = true;
    setIsDetecting(true);
    setStatusText('Detecting...');
    socket.emit('start-detection');

    if (useWebcam) detectWebcam();
    else {
      uploadRef.current.pause();
      detectVideo();
    }
  };

  const stopDetection = () => {
    detectionRef.current = false;
    setIsDetecting(false);
    setStatusText('Detection stopped');
  };

  const detectWebcam = async () => {
    while (detectionRef.current) {
      await analyze(webcamRef.current);
      await new Promise(r => setTimeout(r, FRAME_INTERVAL));
    }
  };

  const detectVideo = async () => {
    const vid = uploadRef.current;
    while (detectionRef.current && vid.currentTime < vid.duration) {
      await analyze(vid);
      vid.currentTime = Math.min(vid.currentTime + FRAME_INTERVAL / 1000, vid.duration);
      console.debug(`Video at ${vid.currentTime.toFixed(2)}s`);
      await new Promise(r => setTimeout(r, FRAME_INTERVAL));
    }
    detectionRef.current = false;
    setIsDetecting(false);
    setStatusText('Detection complete');
    vid.currentTime = 0;
    vid.pause();
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <Header />
      <p className="text-center text-gray-600">{statusText}</p>

      <div className="flex justify-center gap-4 my-4">
        <button onClick={() => setUseWebcam(true)} className={`btn px-4 py-2 rounded-full ${useWebcam ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Webcam</button>
        <button onClick={() => setUseWebcam(false)} className={`btn px-4 py-2 rounded-full ${!useWebcam ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Upload Video</button>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => setMode('squat')} className={`btn px-4 py-2 rounded-full ${mode === 'squat' ? 'bg-green-500 text-white' : 'bg-white border'}`}>Squat</button>
        <button onClick={() => setMode('desk')} className={`btn px-4 py-2 rounded-full ${mode === 'desk' ? 'bg-green-500 text-white' : 'bg-white border'}`}>Desk</button>
      </div>

      <div className="mx-auto mb-4 relative w-fit">
        {useWebcam ? (
          <>
            <video ref={webcamRef} width="640" height="480" autoPlay muted className="rounded-lg shadow" />
            <canvas ref={canvasRef} width="640" height="480" className="absolute top-0 left-0 pointer-events-none" />
          </>
        ) : (
          <>
            <VideoUpload ref={uploadRef} />
            <canvas ref={canvasRef} width="640" height="480" className="absolute top-0 left-0 pointer-events-none" />
          </>
        )}
      </div>

      <div className="text-center mb-4 flex justify-center gap-4">
        <button onClick={startDetection} disabled={!detector}
          className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow">
          {isDetecting ? <Loader className="animate-spin w-5 h-5" /> : 'Start Detection'}
        </button>
        {isDetecting && (
          <button onClick={stopDetection}
            className="px-6 py-3 bg-red-600 text-white rounded-full shadow">
            Stop
          </button>
        )}
      </div>

      <FeedbackOverlay postureStatus={posture} />

      <div className="w-full mx-auto mt-6">
        <h3 className="text-lg mb-2 text-gray-700">Posture Score Over Time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={scoreHistory.map((d, i) => ({ index: i, score: d.score }))}>
            <XAxis dataKey="index" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line dataKey="score" stroke="#10B981" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Home;
