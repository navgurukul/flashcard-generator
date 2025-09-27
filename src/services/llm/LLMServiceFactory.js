import { GeminiLLMService } from './GeminiLLMService.js';

/**
 * Factory for creating LLM service instances
 * Supports pluggable LLM providers
 */
export class LLMServiceFactory {
  /**
   * Available LLM service types
   */
  static SERVICE_TYPES = {
    GEMINI: 'gemini'
  };

  /**
   * Create an LLM service instance
   * @param {string} serviceType - The type of service to create
   * @param {string} apiKey - The API key for the service
   * @param {Object} options - Additional options for the service
   * @returns {LLMService} - The LLM service instance
   */
  static createService(serviceType, apiKey, options = {}) {
    switch (serviceType) {
      case LLMServiceFactory.SERVICE_TYPES.GEMINI:
        return new GeminiLLMService(apiKey, options.model);
      
      default:
        throw new Error(`Unsupported LLM service type: ${serviceType}`);
    }
  }

  /**
   * Get available service types
   * @returns {Object} - Available service types
   */
  static getAvailableServices() {
    return LLMServiceFactory.SERVICE_TYPES;
  }

  /**
   * Check if a service type is supported
   * @param {string} serviceType - The service type to check
   * @returns {boolean} - Whether the service type is supported
   */
  static isServiceSupported(serviceType) {
    return Object.values(LLMServiceFactory.SERVICE_TYPES).includes(serviceType);
  }
}