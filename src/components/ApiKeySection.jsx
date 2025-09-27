import { useState } from 'react';
import { useApiKey } from '../hooks/useApiKey';

export const ApiKeySection = () => {
  const { apiKey, updateApiKey, isVisible, toggleVisibility, hasApiKey } = useApiKey();
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSaveApiKey = () => {
    if (hasApiKey) {
      setStatusMessage('API key saved successfully!');
      setIsSuccess(true);
    } else {
      setStatusMessage('Failed to save API key. Please try again.');
      setIsSuccess(false);
    }

    // Hide status message after 3 seconds
    setTimeout(() => {
      setStatusMessage('');
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <div className="api-key-section">
      <h2>API Key Settings</h2>
      <p className="api-key-info">
        You need a Gemini API key to use this application. You can get your Gemini API key from{' '}
        <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
          Google AI Studio
        </a>.
      </p>
      
      <div className="input-group">
        <input
          type={isVisible ? 'text' : 'password'}
          id="apiKeyInput"
          placeholder="Enter your Gemini API key"
          value={apiKey}
          onChange={(e) => updateApiKey(e.target.value)}
        />
        <button type="button" className="icon-button" onClick={toggleVisibility}>
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>
      
      <button type="button" id="saveApiKeyBtn" onClick={handleSaveApiKey}>
        Save API Key
      </button>
      <div className={`status-message ${isSuccess ? 'success' : ''}`}>
        {statusMessage}
      </div>
    </div>
  );
};