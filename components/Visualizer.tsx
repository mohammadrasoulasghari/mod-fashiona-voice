import React from 'react';

interface VisualizerProps {
  isActive: boolean;
  volume: number;
}

export const Visualizer: React.FC<VisualizerProps> = ({ isActive, volume }) => {
  // Normalize volume for visualization scale (0 to 1 -> 1 to 1.5ish)
  const scale = isActive ? 1 + (volume * 2) : 1;
  
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer Pulse Rings */}
      <div 
        className={`absolute w-full h-full rounded-full border border-gold-200 transition-all duration-100 ease-out ${isActive ? 'opacity-100' : 'opacity-20'}`}
        style={{ transform: `scale(${scale * 1.1})`, opacity: isActive ? 0.3 : 0.1 }}
      />
      <div 
        className={`absolute w-56 h-56 rounded-full border border-gold-300 transition-all duration-100 ease-out ${isActive ? 'opacity-100' : 'opacity-20'}`}
        style={{ transform: `scale(${scale * 1.05})`, opacity: isActive ? 0.4 : 0.1 }}
      />
      
      {/* Main Circle */}
      <div 
        className={`relative z-10 w-48 h-48 rounded-full flex items-center justify-center bg-gradient-to-br from-white to-gold-50 shadow-[0_0_40px_-10px_rgba(212,175,55,0.3)] transition-all duration-500
          ${isActive ? 'shadow-[0_0_60px_-5px_rgba(212,175,55,0.6)]' : ''}`}
      >
        <div className={`w-40 h-40 rounded-full bg-white flex items-center justify-center border-4 ${isActive ? 'border-gold-400' : 'border-gray-100'}`}>
           {/* Icon or Status Text */}
           {isActive ? (
             <div className="flex gap-1 items-center h-8">
               <div className="w-1 h-3 bg-gold-500 rounded-full animate-[bounce_1s_infinite]"></div>
               <div className="w-1 h-5 bg-gold-500 rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
               <div className="w-1 h-8 bg-gold-500 rounded-full animate-[bounce_1s_infinite_0.4s]"></div>
               <div className="w-1 h-5 bg-gold-500 rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
               <div className="w-1 h-3 bg-gold-500 rounded-full animate-[bounce_1s_infinite]"></div>
             </div>
           ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
             </svg>
           )}
        </div>
      </div>
    </div>
  );
};