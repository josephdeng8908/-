import React from 'react';
import { HistoryItem } from '../types';

interface HistoryViewProps {
  history: HistoryItem[];
  onBack: () => void;
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onBack, onSelect, onClear }) => {

  const handleClear = () => {
    if (window.confirm('您确定要清空所有历史记录吗？此操作无法撤销。')) {
      onClear();
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-900 text-white">
      <header className="flex-shrink-0 bg-gray-800 shadow-md z-10">
        <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="返回主页"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">识别历史</h1>
          <button
            onClick={handleClear}
            disabled={history.length === 0}
            className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="清空历史记录"
          >
            清空记录
          </button>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg">还没有历史记录</p>
            <p className="mt-1">快去拍照识别吧！</p>
          </div>
        ) : (
          <ul className="max-w-4xl mx-auto p-4 space-y-4">
            {history.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item)}
                  className="w-full flex items-center bg-gray-800 p-3 rounded-lg shadow hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <img 
                    src={item.imageDataUrl} 
                    alt="识别的物体" 
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md flex-shrink-0 mr-4"
                  />
                  <div className="flex-grow text-left">
                    <p 
                      className="text-2xl md:text-4xl font-bold tracking-widest"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
                    >
                      {item.result.map(r => r.character).join('')}
                    </p>
                    <p className="text-gray-400 text-sm md:text-base mt-1">
                      {item.result.map(r => r.pinyin).join(' ')}
                    </p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default HistoryView;
