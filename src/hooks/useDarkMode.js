import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  // Check localStorage for saved theme preference, default to system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      return JSON.parse(savedTheme);
    }
    // Default to system preference, but handle test environment
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // Default to light mode in test environment
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply theme to document (only in browser environment)
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.style.colorScheme = 'light';
      }
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return {
    isDarkMode,
    toggleDarkMode
  };
};