import { LLMService } from './LLMService.js';

/**
 * Gemini LLM Service implementation
 * Uses Google's Gemini API for content generation
 */
export class GeminiLLMService extends LLMService {
  constructor(apiKey, model = 'gemini-2.0-flash') {
    super(apiKey);
    this.model = model;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  /**
   * Generate content using Gemini API
   * @param {string} prompt - The prompt to send to Gemini
   * @returns {Promise<Object>} - Response in Gemini multimodal format with parts
   */
  async generate(prompt) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key is not configured');
    }

    const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });

    // For real responses, check the ok property
    // For mocked responses in tests, ok might be undefined, so we check explicitly
    if (response.ok === false) {
      throw new Error(`Gemini API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Return the full response in Gemini multimodal format
    return data;
  }

  /**
   * Get the service name
   * @returns {string} - The service name
   */
  getServiceName() {
    return 'gemini';
  }

  /**
   * Get the model being used
   * @returns {string} - The model name
   */
  getModel() {
    return this.model;
  }
}