import { useState, useEffect } from 'react';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on mount
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const updateApiKey = (newApiKey) => {
    setApiKey(newApiKey);
    if (newApiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, newApiKey.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const getApiKey = () => {
    return apiKey.trim() || localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  };

  return {
    apiKey,
    updateApiKey,
    isVisible,
    toggleVisibility,
    getApiKey,
    hasApiKey: Boolean(getApiKey())
  };
};