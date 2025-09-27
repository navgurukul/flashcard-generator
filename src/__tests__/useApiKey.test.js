import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useApiKey } from '../hooks/useApiKey';

describe('useApiKey', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty API key', () => {
    const { result } = renderHook(() => useApiKey());
    
    expect(result.current.apiKey).toBe('');
    expect(result.current.hasApiKey).toBe(false);
    expect(result.current.isVisible).toBe(false);
  });

  it('loads API key from localStorage on mount', () => {
    localStorage.setItem('gemini_api_key', 'saved-key');
    
    const { result } = renderHook(() => useApiKey());
    
    expect(result.current.apiKey).toBe('saved-key');
    expect(result.current.hasApiKey).toBe(true);
  });

  it('updates API key and saves to localStorage', () => {
    const { result } = renderHook(() => useApiKey());
    
    act(() => {
      result.current.updateApiKey('new-api-key');
    });
    
    expect(result.current.apiKey).toBe('new-api-key');
    expect(result.current.hasApiKey).toBe(true);
    expect(localStorage.getItem('gemini_api_key')).toBe('new-api-key');
  });

  it('removes API key from localStorage when empty', () => {
    localStorage.setItem('gemini_api_key', 'existing-key');
    const { result } = renderHook(() => useApiKey());
    
    act(() => {
      result.current.updateApiKey('');
    });
    
    expect(result.current.apiKey).toBe('');
    expect(result.current.hasApiKey).toBe(false);
    expect(localStorage.getItem('gemini_api_key')).toBeNull();
  });

  it('toggles visibility state', () => {
    const { result } = renderHook(() => useApiKey());
    
    expect(result.current.isVisible).toBe(false);
    
    act(() => {
      result.current.toggleVisibility();
    });
    
    expect(result.current.isVisible).toBe(true);
    
    act(() => {
      result.current.toggleVisibility();
    });
    
    expect(result.current.isVisible).toBe(false);
  });

  it('getApiKey returns current or stored API key', () => {
    localStorage.setItem('gemini_api_key', 'stored-key');
    const { result } = renderHook(() => useApiKey());
    
    expect(result.current.getApiKey()).toBe('stored-key');
    
    act(() => {
      result.current.updateApiKey('current-key');
    });
    
    expect(result.current.getApiKey()).toBe('current-key');
  });

  it('trims whitespace from API key', () => {
    const { result } = renderHook(() => useApiKey());
    
    act(() => {
      result.current.updateApiKey('  key-with-spaces  ');
    });
    
    expect(localStorage.getItem('gemini_api_key')).toBe('key-with-spaces');
    expect(result.current.getApiKey()).toBe('key-with-spaces');
  });
});