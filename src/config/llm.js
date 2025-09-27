/**
 * LLM Service Configuration
 * Centralizes configuration for different LLM providers
 */

export const LLM_CONFIG = {
  // Default LLM service to use
  DEFAULT_SERVICE: 'gemini',
  
  // Service-specific configurations
  SERVICES: {
    gemini: {
      name: 'Google Gemini',
      type: 'gemini',
      defaultModel: 'gemini-2.0-flash',
      availableModels: [
        'gemini-2.0-flash',
        'gemini-1.5-pro',
        'gemini-1.5-flash'
      ],
      description: 'Google\'s multimodal AI model for text generation'
    }
    // Future LLM providers can be added here
    // openai: {
    //   name: 'OpenAI GPT',
    //   type: 'openai',
    //   defaultModel: 'gpt-4',
    //   availableModels: ['gpt-4', 'gpt-3.5-turbo'],
    //   description: 'OpenAI\'s language models'
    // }
  }
};

/**
 * Get configuration for a specific LLM service
 * @param {string} serviceType - The service type to get config for
 * @returns {Object|null} - Service configuration or null if not found
 */
export function getLLMServiceConfig(serviceType) {
  return LLM_CONFIG.SERVICES[serviceType] || null;
}

/**
 * Get all available LLM services
 * @returns {Object} - All available service configurations
 */
export function getAvailableLLMServices() {
  return LLM_CONFIG.SERVICES;
}

/**
 * Get the default LLM service type
 * @returns {string} - Default service type
 */
export function getDefaultLLMService() {
  return LLM_CONFIG.DEFAULT_SERVICE;
}