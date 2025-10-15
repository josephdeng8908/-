import { useState, useEffect } from 'react';
import { Settings } from '../types';

const SETTINGS_KEY = 'ai_settings';

const getDefaultSettings = (): Settings => ({
  useCustomApi: false,
  apiUrl: '',
  apiKey: '',
  model: '',
});

export const useSettings = (): [Settings, (settings: Settings) => void] => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        return { ...getDefaultSettings(), ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
    return getDefaultSettings();
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

  return [settings, setSettings];
};
