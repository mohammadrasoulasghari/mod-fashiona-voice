import { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { blobToBase64, decode, decodeAudioData } from '../utils/audioUtils';

interface UseGeminiAudioProps {
  systemInstruction: string;
}

export type AudioStatus = 'idle' | 'recording' | 'processing' | 'result' | 'error';

export const useGeminiAudio = ({ systemInstruction }: UseGeminiAudioProps) => {
  const [status, setStatus] = useState<AudioStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Visualizer setup
      analysisContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = analysisContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      sourceNodeRef.current = analysisContextRef.current.createMediaStreamSource(stream);
      sourceNodeRef.current.connect(analyserRef.current);
      
      const updateVolume = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(avg / 128); // Normalize somewhat
        animationRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // Recorder setup
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setStatus('recording');

    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("دسترسی به میکروفون امکان‌پذیر نیست.");
      setStatus('error');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || status !== 'recording') return;

    return new Promise<void>((resolve) => {
      mediaRecorderRef.current!.onstop = async () => {
        // Stop tracks and cleanup visualization
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (analysisContextRef.current) analysisContextRef.current.close();
        setVolume(0);

        setStatus('processing');

        // Create Blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          const base64Audio = await blobToBase64(audioBlob);
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          // STEP 1: Process User Audio -> Generate Text Response
          // We use 'gemini-3-flash-preview' as it supports multimodal input (audio) and is efficient.
          const textResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType: 'audio/webm',
                    data: base64Audio
                  }
                },
                {
                   text: "Listen to the user's question in Persian and provide a concise, friendly, and professional answer in Persian. Do not use markdown."
                }
              ]
            },
            config: {
              systemInstruction: systemInstruction,
            }
          });

          const generatedText = textResponse.text;
          
          if (!generatedText) {
            throw new Error("No text response generated from audio input.");
          }

          // STEP 2: Convert Generated Text -> Audio (TTS)
          // We use 'gemini-2.5-flash-preview-tts' which is specialized for speech generation.
          const ttsResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: {
                parts: [{ text: generatedText }]
            },
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
              },
            }
          });

          // Extract Audio Response
          const responseAudioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          
          if (!responseAudioBase64) {
            throw new Error("No audio response generated from TTS.");
          }

          // Decode for playback
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const decodedBuffer = await decodeAudioData(decode(responseAudioBase64), ctx);
          setAudioBuffer(decodedBuffer);
          setStatus('result');

        } catch (err) {
          console.error("Gemini processing error:", err);
          setError("خطا در پردازش هوش مصنوعی. لطفا دوباره تلاش کنید.");
          setStatus('error');
        }
        resolve();
      };

      mediaRecorderRef.current!.stop();
    });
  }, [status, systemInstruction]);

  const reset = useCallback(() => {
    setStatus('idle');
    setAudioBuffer(null);
    setError(null);
    setVolume(0);
  }, []);

  return {
    status,
    error,
    volume,
    audioBuffer,
    startRecording,
    stopRecording,
    reset
  };
};