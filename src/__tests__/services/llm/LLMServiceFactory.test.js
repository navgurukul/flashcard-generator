import { describe, it, expect } from 'vitest';
import { LLMServiceFactory } from '../../../services/llm/LLMServiceFactory.js';
import { GeminiLLMService } from '../../../services/llm/GeminiLLMService.js';

describe('LLMServiceFactory', () => {
  it('creates Gemini service', () => {
    const service = LLMServiceFactory.createService('gemini', 'test-api-key');
    
    expect(service).toBeInstanceOf(GeminiLLMService);
    expect(service.apiKey).toBe('test-api-key');
    expect(service.getServiceName()).toBe('gemini');
  });

  it('creates Gemini service with custom model', () => {
    const service = LLMServiceFactory.createService('gemini', 'test-api-key', { model: 'gemini-1.5-pro' });
    
    expect(service).toBeInstanceOf(GeminiLLMService);
    expect(service.getModel()).toBe('gemini-1.5-pro');
  });

  it('throws error for unsupported service type', () => {
    expect(() => {
      LLMServiceFactory.createService('unsupported', 'test-api-key');
    }).toThrow('Unsupported LLM service type: unsupported');
  });

  it('returns available service types', () => {
    const services = LLMServiceFactory.getAvailableServices();
    
    expect(services).toEqual({
      GEMINI: 'gemini'
    });
  });

  it('checks if service type is supported', () => {
    expect(LLMServiceFactory.isServiceSupported('gemini')).toBe(true);
    expect(LLMServiceFactory.isServiceSupported('unsupported')).toBe(false);
  });
});