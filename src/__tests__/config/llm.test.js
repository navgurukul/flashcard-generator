import { describe, it, expect } from 'vitest';
import { 
  getLLMServiceConfig, 
  getAvailableLLMServices, 
  getDefaultLLMService 
} from '../../config/llm.js';

describe('LLM Configuration', () => {
  it('returns Gemini service configuration', () => {
    const config = getLLMServiceConfig('gemini');
    
    expect(config).toEqual({
      name: 'Google Gemini',
      type: 'gemini',
      defaultModel: 'gemini-2.0-flash',
      availableModels: [
        'gemini-2.0-flash',
        'gemini-1.5-pro',
        'gemini-1.5-flash'
      ],
      description: 'Google\'s multimodal AI model for text generation'
    });
  });

  it('returns null for unknown service', () => {
    const config = getLLMServiceConfig('unknown');
    
    expect(config).toBeNull();
  });

  it('returns all available services', () => {
    const services = getAvailableLLMServices();
    
    expect(services).toHaveProperty('gemini');
    expect(services.gemini.name).toBe('Google Gemini');
  });

  it('returns default service type', () => {
    const defaultService = getDefaultLLMService();
    
    expect(defaultService).toBe('gemini');
  });
});