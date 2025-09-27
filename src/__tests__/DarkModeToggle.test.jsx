import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DarkModeToggle } from '../components/DarkModeToggle';

// Mock the useDarkMode hook
const mockToggleDarkMode = vi.fn();
let mockIsDarkMode = false;

vi.mock('../hooks/useDarkMode', () => ({
  useDarkMode: () => ({
    isDarkMode: mockIsDarkMode,
    toggleDarkMode: mockToggleDarkMode
  })
}));

describe('DarkModeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDarkMode = false;
  });

  it('renders moon icon in light mode', () => {
    render(<DarkModeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('🌙');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('renders sun icon in dark mode', () => {
    mockIsDarkMode = true;
    render(<DarkModeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('☀️');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('calls toggleDarkMode when clicked', () => {
    render(<DarkModeToggle />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockToggleDarkMode).toHaveBeenCalledTimes(1);
  });
});