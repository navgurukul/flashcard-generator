import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiLLMService } from '../../../services/llm/GeminiLLMService.js';

// Mock fetch
globalThis.fetch = vi.fn();

describe('GeminiLLMService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates service with API key', () => {
    const service = new GeminiLLMService('test-api-key');
    
    expect(service.apiKey).toBe('test-api-key');
    expect(service.getServiceName()).toBe('gemini');
    expect(service.getModel()).toBe('gemini-2.0-flash');
    expect(service.isConfigured()).toBe(true);
  });

  it('creates service with custom model', () => {
    const service = new GeminiLLMService('test-api-key', 'gemini-1.5-pro');
    
    expect(service.getModel()).toBe('gemini-1.5-pro');
  });

  it('reports not configured without API key', () => {
    const service = new GeminiLLMService('');
    
    expect(service.isConfigured()).toBe(false);
  });

  it('throws error when generating without API key', async () => {
    const service = new GeminiLLMService('');
    
    await expect(service.generate('test prompt')).rejects.toThrow('Gemini API key is not configured');
  });

  it('generates content successfully', async () => {
    const service = new GeminiLLMService('test-api-key');
    
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: 'Generated response'
          }]
        }
      }]
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    });

    const result = await service.generate('test prompt');
    
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=test-api-key',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'test prompt'
            }]
          }]
        })
      })
    );
  });

  it('handles API errors', async () => {
    const service = new GeminiLLMService('test-api-key');
    
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: () => Promise.resolve({ error: 'API Error' })
    });

    await expect(service.generate('test prompt')).rejects.toThrow('Gemini API request failed: 400 Bad Request');
  });

  it('handles network errors', async () => {
    const service = new GeminiLLMService('test-api-key');
    
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(service.generate('test prompt')).rejects.toThrow('Network error');
  });
});