export enum ViewState {
  WELCOME,
  CAMERA,
  LOADING,
  RESULT,
}

export interface CharacterInfo {
  character: string;
  pinyin: string;
}

export interface Settings {
  useCustomApi: boolean;
  apiUrl: string;
  apiKey: string;
  model: string;
}

// FIX: Added the missing HistoryItem interface.
export interface HistoryItem {
  id: string;
  imageDataUrl: string;
  result: CharacterInfo[];
}
