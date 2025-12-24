// Audio Types for Gemini Live API
export interface GeminiAudioData {
  data: string;
  mimeType: string;
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}

export interface BusinessContext {
  description: string;
}