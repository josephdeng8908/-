import React from 'react';

interface WelcomeViewProps {
  onStart: () => void;
  onOpenSettings: () => void;
}

const CameraIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart, onOpenSettings }) => {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center text-center p-8 bg-gray-900 text-white">
      {/* Main content */}
      <div className="flex flex-col items-center">
        <div className="mb-8">
          <h1 
            className="text-5xl md:text-7xl font-bold text-white"
            style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
          >
            拍照识字
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-md">
            拍下身边的万物，学习对应的汉字
          </p>
        </div>
        
        <div className="mt-8">
          <button
            onClick={onStart}
            className="px-10 py-5 bg-white bg-opacity-20 text-white text-2xl font-semibold rounded-full shadow-lg hover:bg-opacity-30 backdrop-blur-sm transition-all duration-300 ease-in-out flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 transform hover:scale-105"
            aria-label="开始拍照识别"
          >
            <CameraIcon />
            开始拍照
          </button>
        </div>
      </div>

      {/* Settings button at the bottom */}
      <div className="absolute bottom-0 w-full pb-8 flex justify-center items-center">
        <button
          onClick={onOpenSettings}
          className="text-gray-400 hover:text-white underline focus:outline-none focus:ring-2 focus:ring-gray-500 rounded px-2 py-1"
          aria-label="配置自定义模型"
        >
          配置自定义模型
        </button>
      </div>
    </div>
  );
};

export default WelcomeView;