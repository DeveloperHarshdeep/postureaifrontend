import React from 'react';
import { Bot } from 'lucide-react';

const Header = () => {
  return (
    <header style={{padding: '20px'}} className="bg-grey-900 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="w-full mx-auto px-6 py-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="text-indigo-600 w-6 h-6" />
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
            PostureAI Studio
          </h1>
        </div>
        <span className="hidden sm:block text-sm text-gray-500 font-medium">
          Real-time AI Posture Detection
        </span>
      </div>
    </header>
  );
};

export default Header;
