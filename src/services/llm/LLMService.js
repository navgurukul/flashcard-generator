/**
 * Abstract base class for LLM services
 * All LLM implementations should extend this class and implement the generate method
 * The response format should always follow Gemini multimodal format (with parts)
 */
export class LLMService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Generate content using the LLM
   * @param {string} prompt - The prompt to send to the LLM
   * @returns {Promise<Object>} - Response in Gemini multimodal format with parts
   */
  // eslint-disable-next-line no-unused-vars
  async generate(prompt) {
    throw new Error('generate method must be implemented by subclass');
  }

  /**
   * Validate if the service is properly configured
   * @returns {boolean} - Whether the service is ready to use
   */
  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Get the service name/type
   * @returns {string} - The service name
   */
  getServiceName() {
    throw new Error('getServiceName method must be implemented by subclass');
  }
}