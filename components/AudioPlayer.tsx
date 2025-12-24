import React, { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  audioBuffer: AudioBuffer | null;
  onReset: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBuffer, onReset }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize AudioContext
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      stopAudio();
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, [audioBuffer]);

  const playAudio = () => {
    if (!audioContextRef.current || !audioBuffer) return;

    // Create a new source
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    
    // Calculate start time based on where we paused
    const offset = pausedAtRef.current % audioBuffer.duration;
    
    source.start(0, offset);
    sourceRef.current = source;
    startTimeRef.current = audioContextRef.current.currentTime - offset;
    
    setIsPlaying(true);
    
    source.onended = () => {
      // Only reset if we reached the end naturally (not stopped manually to pause)
      if (audioContextRef.current && audioContextRef.current.currentTime - startTimeRef.current >= audioBuffer.duration - 0.1) {
         setIsPlaying(false);
         pausedAtRef.current = 0;
         setProgress(0);
         cancelAnimation();
      }
    };

    // Animation loop for progress
    const updateProgress = () => {
      if (!audioContextRef.current || !audioBuffer) return;
      const current = audioContextRef.current.currentTime - startTimeRef.current;
      const p = Math.min((current / audioBuffer.duration) * 100, 100);
      setProgress(p);
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };
    updateProgress();
  };

  const pauseAudio = () => {
    if (sourceRef.current && audioContextRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
      pausedAtRef.current = audioContextRef.current.currentTime - startTimeRef.current;
      setIsPlaying(false);
      cancelAnimation();
    }
  };

  const stopAudio = () => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) { /* ignore */ }
      sourceRef.current = null;
    }
    cancelAnimation();
  };

  const cancelAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  if (!audioBuffer) return null;

  const duration = audioBuffer.duration;
  const currentTime = (progress / 100) * duration;

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gold-200 p-6 flex flex-col items-center animate-fade-in-up">
      <div className="flex items-center justify-between w-full mb-6">
        <h3 className="text-lg font-bold text-gray-800">پاسخ هوش مصنوعی</h3>
        <span className="text-xs font-mono text-gold-600 bg-gold-50 px-2 py-1 rounded-full">AI VOICE</span>
      </div>

      <div className="w-full flex items-center gap-4 mb-4">
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all"
        >
          {isPlaying ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M10 9v6h4v-6h-4zm-7-6v20h18v-20h-18zm16 18h-14v-16h14v16z"/> {/* Simplified Pause */}
               <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
             </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
             </svg>
          )}
        </button>
        
        <div className="flex-grow flex flex-col gap-1">
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gold-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="text-sm text-gray-500 hover:text-gold-600 underline decoration-gold-300 decoration-1 underline-offset-4 transition-colors"
      >
        پرسش سوال جدید
      </button>
    </div>
  );
};