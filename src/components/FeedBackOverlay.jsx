import React from 'react';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

const FeedbackOverlay = ({ postureStatus }) => {
const getStatusUI = () => {
  switch (postureStatus.status) {
    case 'good':
      return {
        icon: <CheckCircle className="text-green-600 w-6 h-6" />,
        text: 'Good Posture',
        style: 'bg-green-50 text-green-800 border-green-300',
      };
    case 'bad':
      return {
        icon: <AlertTriangle className="text-red-600 w-6 h-6" />,
        text: 'Bad Posture Detected',
        style: 'bg-red-50 text-red-800 border-red-300',
      };
    default:
      return {
        icon: <Loader2 className="animate-spin text-gray-500 w-5 h-5" />,
        text: 'Analyzing posture...',
        style: 'bg-gray-50 text-gray-700 border-gray-300',
      };
  }
};


  const { icon, text, style } = getStatusUI();

  return (
    <div className="mt-6 flex justify-center">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-full border shadow-md text-sm font-medium transition duration-300 ${style}`}
      >
        {icon}
        <span>{text}</span>
      </div>
    </div>
  );
};

export default FeedbackOverlay;
