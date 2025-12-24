import React, { useState } from 'react';
import { SettingsBox } from './components/SettingsBox';
import { Visualizer } from './components/Visualizer';
import { AudioPlayer } from './components/AudioPlayer';
import { useGeminiAudio } from './hooks/useGeminiLive';

const App: React.FC = () => {
  const [description, setDescription] = useState<string>(
    "نام بیزینس: آکادمی مد و فشن رویال.\nزمینه فعالیت: آموزش تخصصی طراحی لباس، الگوسازی، دوخت و استایلینگ.\nمکان: تهران، زعفرانیه.\nما بر روی خلاقیت هنرجویان تمرکز داریم و مدارک بین‌المللی ارائه می‌دهیم.\nلحن صحبت: محترمانه، حرفه‌ای و صمیمی."
  );

  const fullSystemInstruction = `
    تو یک دستیار هوشمند، خوش‌سخن و بسیار باکلاس برای "آکادمی مد و فشن" هستی.
    قانون مهم: تو باید "فقط و فقط" به زبان فارسی صحبت کنی.
    پاسخ‌هایت باید کوتاه، صوتی و جذاب باشند.
    
    اطلاعات کسب و کار:
    ${description}
  `;

  const { status, error, volume, audioBuffer, startRecording, stopRecording, reset } = useGeminiAudio({
    systemInstruction: fullSystemInstruction
  });

  const handleMicClick = () => {
    if (status === 'idle' || status === 'error') {
      startRecording();
    } else if (status === 'recording') {
      stopRecording();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center py-12 px-4 font-sans">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          <span className="text-gold-500">آکادمی</span> مد و فشن
        </h1>
        <p className="text-gold-600 text-sm font-medium tracking-widest uppercase opacity-80">
          Luxury Fashion Education
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl flex flex-col items-center gap-8">
        
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm w-full max-w-md text-center animate-fade-in shadow-sm">
            {error}
          </div>
        )}

        {/* Dynamic Content based on Status */}
        {status === 'result' ? (
          <AudioPlayer audioBuffer={audioBuffer} onReset={reset} />
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* Visualizer Area */}
            <div className="mb-8 relative">
              <Visualizer isActive={status === 'recording' || status === 'processing'} volume={volume} />
              
              <div className="absolute -bottom-10 left-0 right-0 text-center h-8">
                {status === 'processing' ? (
                   <div className="flex items-center justify-center gap-2 text-gold-600 font-medium animate-pulse">
                     <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     <span>در حال تولید پاسخ...</span>
                   </div>
                ) : status === 'recording' ? (
                   <span className="text-red-500 font-medium animate-pulse">در حال ضبط...</span>
                ) : (
                   <span className="text-gray-400 font-medium">برای صحبت لمس کنید</span>
                )}
              </div>
            </div>

            {/* Mic Button */}
            <button
              onClick={handleMicClick}
              disabled={status === 'processing'}
              className={`
                group relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl
                ${status === 'recording'
                  ? 'bg-red-500 text-white shadow-red-200 ring-4 ring-red-100 scale-110' 
                  : status === 'processing'
                  ? 'bg-gray-200 text-gray-400 cursor-wait'
                  : 'bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-gold-200'
                }
              `}
            >
              {status === 'recording' ? (
                <div className="w-8 h-8 bg-white rounded-md transition-all duration-300" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          </div>
        )}

        <div className="w-full max-w-md border-t border-gray-200 opacity-50"></div>

        {/* Configuration Box */}
        <SettingsBox 
          description={description} 
          setDescription={setDescription} 
          disabled={status !== 'idle'}
        />

      </main>

      {/* Footer */}
      <footer className="mt-auto pt-6 text-center text-gray-400 text-xs">
        <p>© 2024 Fashion Academy AI Assistant</p>
      </footer>
    </div>
  );
};

export default App;