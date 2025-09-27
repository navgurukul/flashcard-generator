import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDarkMode } from '../hooks/useDarkMode';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

describe('useDarkMode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('initializes with false when no saved preference and no window.matchMedia', () => {
    const { result } = renderHook(() => useDarkMode());
    
    expect(result.current.isDarkMode).toBe(false);
  });

  it('initializes with saved preference from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('true');
    
    const { result } = renderHook(() => useDarkMode());
    
    expect(result.current.isDarkMode).toBe(true);
  });

  it('toggles dark mode', () => {
    const { result } = renderHook(() => useDarkMode());
    
    expect(result.current.isDarkMode).toBe(false);
    
    act(() => {
      result.current.toggleDarkMode();
    });
    
    expect(result.current.isDarkMode).toBe(true);
  });

  it('saves preference to localStorage when toggled', () => {
    const { result } = renderHook(() => useDarkMode());
    
    act(() => {
      result.current.toggleDarkMode();
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'true');
  });
});