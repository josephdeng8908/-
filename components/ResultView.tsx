import React, { useCallback, useRef, useEffect } from 'react';
import { CharacterInfo } from '../types';

interface ResultViewProps {
  imageDataUrl: string;
  result: CharacterInfo[];
  onRetake: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ imageDataUrl, result, onRetake }) => {
  // Use a ref for the cache to persist Audio objects across re-renders for stability
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());
  const currentlyPlayingRef = useRef<HTMLAudioElement | null>(null);
  const initialPlayRef = useRef(false);

  // Updated playPronunciation with robust error handling and recovery
  const playPronunciation = useCallback((text: string) => {
    if (currentlyPlayingRef.current) {
        currentlyPlayingRef.current.pause();
        currentlyPlayingRef.current.currentTime = 0;
    }

    const audio = audioCache.current.get(text);
    if (audio) {
      audio.currentTime = 0;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            currentlyPlayingRef.current = audio;
          })
          .catch(error => {
            console.error(`Error playing audio for "${text}":`, error);
            // If playback fails, it might be due to a network error during initial load.
            // Calling load() tells the element to re-fetch its media, attempting to recover.
            if (audio.error) {
              console.log(`Attempting to reload failed audio source for "${text}".`);
              audio.load();
            }
          });
      } else {
        // Fallback for older browsers that don't return a promise
        currentlyPlayingRef.current = audio;
      }
    } else {
      console.warn(`Audio for "${text}" not found in cache.`);
    }
  }, []); // Empty dependency array as it only uses refs

  // Effect to pre-load audio for the current word and its characters.
  // It only loads what's not already in the persistent cache.
  useEffect(() => {
    if (!result || result.length === 0) return;

    const cache = audioCache.current;
    const fullWord = result.map(item => item.character).join('');
    const allTexts = [...result.map(item => item.character), fullWord].filter(Boolean);

    allTexts.forEach(text => {
        if (!cache.has(text)) {
            const encodedText = encodeURIComponent(text);
            const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=zh-CN&client=tw-ob`;
            const audio = new Audio(audioUrl);
            audio.preload = 'auto';
            cache.set(text, audio);
        }
    });
    
    initialPlayRef.current = false; // Reset auto-play flag for new results
    
  }, [result]);

  // Effect to play the full word once after the audio objects have been prepared.
  useEffect(() => {
    const word = result.map(item => item.character).join('');
    // Ensure the word exists, its audio is in the cache, and it hasn't been auto-played yet.
    if (word && audioCache.current.has(word) && !initialPlayRef.current) {
      // A small delay lets the user see the screen first
      const timer = setTimeout(() => {
        playPronunciation(word);
        initialPlayRef.current = true;
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [result, playPronunciation]);

  const fullWord = result.map(item => item.character).join('');

  const handlePronounceWord = useCallback(() => {
    playPronunciation(fullWord);
  }, [fullWord, playPronunciation]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-white">
      {/* Background Image */}
      <img 
        src={imageDataUrl} 
        alt="Captured scene" 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{ filter: 'blur(8px) brightness(0.6)' }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-between p-6 animate-fade-in-content">
        {/* Top bar with back button */}
        <div className="w-full flex justify-start">
          <button
            onClick={onRetake}
            className="p-3 bg-black bg-opacity-30 rounded-full text-white hover:bg-opacity-50 transition-colors"
            aria-label="重拍"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Main Result */}
        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <div className="flex flex-wrap justify-center items-end gap-x-2 md:gap-x-4">
            {result.map((item, index) => (
              <div key={`${item.character}-${index}`} className="flex flex-col items-center">
                <p 
                  className="text-2xl md:text-4xl text-gray-300 mb-1 md:mb-2 tracking-wider"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                >
                  {item.pinyin}
                </p>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    playPronunciation(item.character);
                  }}
                  className="cursor-pointer transition-transform transform hover:scale-110 inline-block font-bold text-white"
                  style={{ 
                    fontSize: 'clamp(4rem, 25vw, 10rem)', 
                    lineHeight: 1.1,
                    textShadow: '0 4px 20px rgba(0,0,0,0.6)' 
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && playPronunciation(item.character)}
                  aria-label={`朗读 ${item.character}`}
                >
                  {item.character}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar with controls */}
        <div className="w-full flex justify-center items-center gap-x-8 pb-4">
           <button
            onClick={onRetake}
            className="px-8 py-4 bg-white bg-opacity-20 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-opacity-30 backdrop-blur-sm transition-all duration-200 flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
            aria-label="重新拍照"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            重拍
          </button>
          
          <button
            onClick={handlePronounceWord}
            className="p-4 bg-white bg-opacity-20 text-white rounded-full shadow-lg hover:bg-opacity-30 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
            aria-label="朗读"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-content {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-content { animation: fade-in-content 0.5s ease-out forwards; }
      `}} />
    </div>
  );
};

export default ResultView;