// src/components/VideoUpload.jsx
import React, { forwardRef } from 'react';

const VideoUpload = forwardRef(({ onReady }, ref) => {
  const handleChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      ref.current.src = url;
      ref.current.controls = true;
      ref.current.pause();
      ref.current.addEventListener('loadeddata', () => onReady && onReady(), { once: true });
    }
  };

  return (
    <div className="text-center">
      <input type="file" accept="video/*" onChange={handleChange} className="mb-4"/>
      <video ref={ref} width="640" height="480" className="rounded-xl border shadow" />
    </div>
  );
});

export default VideoUpload;
