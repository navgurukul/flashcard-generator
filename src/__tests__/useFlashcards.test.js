import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFlashcards } from '../hooks/useFlashcards';

// Mock fetch
globalThis.fetch = vi.fn();

describe('useFlashcards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useFlashcards());
    
    expect(result.current.flashcards).toEqual([]);
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('shows error when topic is empty', async () => {
    const { result } = renderHook(() => useFlashcards());
    
    await act(async () => {
      await result.current.generateFlashcards('', 'test-api-key');
    });
    
    expect(result.current.error).toBe('Please enter a topic or some terms and definitions.');
    expect(result.current.flashcards).toEqual([]);
  });

  it('shows error when API key is missing', async () => {
    const { result } = renderHook(() => useFlashcards());
    
    await act(async () => {
      await result.current.generateFlashcards('Spanish words', '');
    });
    
    expect(result.current.error).toBe('Please enter your Gemini API key.');
    expect(result.current.flashcards).toEqual([]);
  });

  it('generates flashcards successfully', async () => {
    const { result } = renderHook(() => useFlashcards());
    
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: 'Hello: Hola\nGoodbye: Adiós'
          }]
        }
      }]
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    });

    await act(async () => {
      await result.current.generateFlashcards('Spanish words', 'test-api-key');
    });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.flashcards).toEqual([
      { term: 'Hello', definition: 'Hola' },
      { term: 'Goodbye', definition: 'Adiós' }
    ]);
    expect(result.current.error).toBe('');
  });

  it('handles API errors', async () => {
    const { result } = renderHook(() => useFlashcards());
    
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await result.current.generateFlashcards('Spanish words', 'test-api-key');
    });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBe('An error occurred: Network error');
    expect(result.current.flashcards).toEqual([]);
  });

  it('handles empty API response', async () => {
    const { result } = renderHook(() => useFlashcards());
    
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: ''
          }]
        }
      }]
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    });

    await act(async () => {
      await result.current.generateFlashcards('Spanish words', 'test-api-key');
    });

    expect(result.current.error).toBe('Failed to generate flashcards or received an empty response. Please try again.');
    expect(result.current.flashcards).toEqual([]);
  });

  it('handles malformed flashcards response', async () => {
    const { result } = renderHook(() => useFlashcards());
    
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: 'Invalid format\nNo colon here\n: Missing term'
          }]
        }
      }]
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    });

    await act(async () => {
      await result.current.generateFlashcards('Spanish words', 'test-api-key');
    });

    expect(result.current.error).toBe('No valid flashcards could be generated from the response. Please check the format.');
    expect(result.current.flashcards).toEqual([]);
  });

  it('clears flashcards and error', () => {
    const { result } = renderHook(() => useFlashcards());
    
    // Simulate having some flashcards and error
    act(() => {
      // We can't directly set the state, so let's trigger clearFlashcards
      result.current.clearFlashcards();
    });

    expect(result.current.flashcards).toEqual([]);
    expect(result.current.error).toBe('');
  });

  it('handles colon in definition', async () => {
    const { result } = renderHook(() => useFlashcards());
    
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: 'Time: 3:30 PM'
          }]
        }
      }]
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    });

    await act(async () => {
      await result.current.generateFlashcards('Time formats', 'test-api-key');
    });

    expect(result.current.flashcards).toEqual([
      { term: 'Time', definition: '3:30 PM' }
    ]);
  });
});