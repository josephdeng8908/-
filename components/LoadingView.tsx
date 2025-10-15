
import React from 'react';

const LoadingSpinner: React.FC = () => (
    <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-400"></div>
);

const LoadingView: React.FC = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 text-white">
            <LoadingSpinner />
            <p className="mt-6 text-2xl font-semibold">正在努力识别中...</p>
        </div>
    );
};

export default LoadingView;
