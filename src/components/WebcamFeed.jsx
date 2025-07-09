import React from 'react';

const WebcamFeed = ({ videoRef }) => {
  return (
    <div className="relative max-w-xl w-full mx-auto rounded-3xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-xl border border-white/30">
      {/* Fancy glowing animated border effect */}
      <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-2xl" />

      {/* Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="relative z-10 w-full h-auto rounded-3xl border border-white/20"
      />

      {/* Overlay Label */}
      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-20 backdrop-blur-sm">
        Live Webcam Feed
      </div>
    </div>
  );
};

export default WebcamFeed;
