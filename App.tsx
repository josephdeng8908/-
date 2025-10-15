import React, { useState, useCallback } from 'react';
import { ViewState, CharacterInfo, Settings } from './types';
import { identifyImageInChinese } from './services/aiService';
import WelcomeView from './components/WelcomeView';
import CameraView from './components/CameraView';
import ResultView from './components/ResultView';
import LoadingView from './components/LoadingView';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.WELCOME);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [recognizedResult, setRecognizedResult] = useState<CharacterInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleStart = useCallback(() => {
    const SETTINGS_KEY = 'ai_settings';
    let settings: Settings | null = null;
    try {
        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
    }
    
    const isCustomApiConfigured = settings?.useCustomApi && settings?.apiUrl && settings?.apiKey && settings?.model;

    if (!process.env.API_KEY && !isCustomApiConfigured) {
      setIsSettingsOpen(true);
    } else {
      setViewState(ViewState.CAMERA);
    }
  }, []);

  const handleCapture = useCallback(async (dataUrl: string) => {
    setImageDataUrl(dataUrl);
    setViewState(ViewState.LOADING);
    setError(null);
    try {
      const result = await identifyImageInChinese(dataUrl);
      setRecognizedResult(result);
      setViewState(ViewState.RESULT);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : '发生未知错误，请重试。';
      setError(errorMessage);
      setViewState(ViewState.CAMERA);
    }
  }, []);

  const handleRetake = useCallback(() => {
    setImageDataUrl(null);
    setRecognizedResult([]);
    setError(null);
    setViewState(ViewState.CAMERA);
  }, []);
  
  const renderView = () => {
    switch (viewState) {
      case ViewState.WELCOME:
        return <WelcomeView onStart={handleStart} onOpenSettings={() => setIsSettingsOpen(true)} />;
      case ViewState.CAMERA:
        return <CameraView onCapture={handleCapture} error={error} onOpenSettings={() => setIsSettingsOpen(true)} />;
      case ViewState.LOADING:
        return <LoadingView />;
      case ViewState.RESULT:
        if (imageDataUrl && recognizedResult.length > 0) {
          return <ResultView imageDataUrl={imageDataUrl} result={recognizedResult} onRetake={handleRetake} />;
        }
        handleRetake();
        return null;
      default:
        return <WelcomeView onStart={handleStart} onOpenSettings={() => setIsSettingsOpen(true)} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 overflow-hidden select-none">
      {renderView()}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default App;