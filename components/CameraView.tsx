import React, { useRef, useEffect, useCallback, useState } from 'react';

interface CameraViewProps {
  onCapture: (dataUrl: string) => void;
  error: string | null;
  onOpenSettings: () => void;
}

const CameraIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SettingsIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CameraView: React.FC<CameraViewProps> = ({ onCapture, error, onOpenSettings }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("您的浏览器不支持摄像头访问功能。");
        return;
      }

      let mediaStream: MediaStream | null = null;
      try {
        // 1. Prefer the rear camera
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
      } catch (err) {
        console.warn("Could not get environment camera, trying user camera.", err);
        try {
          // 2. Fallback to the front camera
          mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
          });
        } catch (fallbackErr) {
          console.warn("Could not get user camera, trying any camera.", fallbackErr);
          try {
            // 3. Fallback to any available camera
            mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          } catch (genericErr) {
            console.error("Error accessing any camera:", genericErr);
            // Attempt to diagnose the issue further
            try {
              const devices = await navigator.mediaDevices.enumerateDevices();
              const videoDevices = devices.filter(d => d.kind === 'videoinput');
              if (videoDevices.length === 0) {
                setCameraError("未检测到摄像头设备。请确保您的设备有摄像头并且已连接。");
              } else {
                setCameraError("无法访问摄像头。请检查浏览器权限，并确保没有其他应用正在使用摄像头。");
              }
            } catch (enumErr) {
              setCameraError("无法访问摄像头。请检查设备是否连接了摄像头并授予了权限。");
            }
            return;
          }
        }
      }

      if (videoRef.current && mediaStream) {
        videoRef.current.srcObject = mediaStream;
        streamRef.current = mediaStream;
        setCameraError(null);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCaptureClick = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
      }
    }
  }, [onCapture]);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-black text-white">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className={`absolute top-0 left-0 w-full h-full object-cover z-0 ${cameraError ? 'hidden' : ''}`} 
      />
      <canvas ref={canvasRef} className="hidden" />
      
      <button 
        onClick={onOpenSettings}
        className="absolute top-5 right-5 z-20 p-3 bg-black bg-opacity-40 rounded-full text-white hover:bg-opacity-60 transition-colors"
        aria-label="打开设置"
      >
        <SettingsIcon />
      </button>

      {cameraError && (
        <div className="z-20 p-6 bg-gray-800 rounded-lg shadow-lg text-center max-w-sm mx-4">
          <p className="text-xl mb-2 font-bold">摄像头错误</p>
          <p>{cameraError}</p>
        </div>
      )}

      {!cameraError && (
        <div className="absolute bottom-0 left-0 w-full p-8 bg-black bg-opacity-30 z-10 flex flex-col items-center">
          {error && <div className="text-white bg-red-500 rounded-md px-4 py-2 mb-4">{error}</div>}
          <button
            onClick={handleCaptureClick}
            className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="拍照"
          >
            <CameraIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraView;
