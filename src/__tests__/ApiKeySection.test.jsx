import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ApiKeySection } from '../components/ApiKeySection';

describe('ApiKeySection', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders API key section correctly', () => {
    render(<ApiKeySection />);
    
    expect(screen.getByText('API Key Settings')).toBeInTheDocument();
    expect(screen.getByText(/You need a Gemini API key/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Gemini API key')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save API Key' })).toBeInTheDocument();
  });

  it('toggles API key visibility', () => {
    render(<ApiKeySection />);
    
    const input = screen.getByPlaceholderText('Enter your Gemini API key');
    const toggleButton = screen.getByRole('button', { name: 'Show' });
    
    expect(input.type).toBe('password');
    
    fireEvent.click(toggleButton);
    expect(input.type).toBe('text');
    expect(screen.getByRole('button', { name: 'Hide' })).toBeInTheDocument();
    
    fireEvent.click(toggleButton);
    expect(input.type).toBe('password');
    expect(screen.getByRole('button', { name: 'Show' })).toBeInTheDocument();
  });

  it('saves API key to localStorage', () => {
    render(<ApiKeySection />);
    
    const input = screen.getByPlaceholderText('Enter your Gemini API key');
    const saveButton = screen.getByRole('button', { name: 'Save API Key' });
    
    // Enter API key
    fireEvent.change(input, { target: { value: 'test-api-key' } });
    fireEvent.click(saveButton);
    
    expect(localStorage.getItem('gemini_api_key')).toBe('test-api-key');
    expect(screen.getByText('API key saved successfully!')).toBeInTheDocument();
  });

  it('shows error message when saving empty API key', () => {
    render(<ApiKeySection />);
    
    const saveButton = screen.getByRole('button', { name: 'Save API Key' });
    fireEvent.click(saveButton);
    
    expect(screen.getByText('Failed to save API key. Please try again.')).toBeInTheDocument();
  });

  it('loads saved API key from localStorage on mount', () => {
    localStorage.setItem('gemini_api_key', 'saved-api-key');
    
    render(<ApiKeySection />);
    
    const input = screen.getByPlaceholderText('Enter your Gemini API key');
    expect(input.value).toBe('saved-api-key');
  });

  it('clears status message after 3 seconds', async () => {
    render(<ApiKeySection />);
    
    const input = screen.getByPlaceholderText('Enter your Gemini API key');
    const saveButton = screen.getByRole('button', { name: 'Save API Key' });
    
    fireEvent.change(input, { target: { value: 'test-api-key' } });
    fireEvent.click(saveButton);
    
    expect(screen.getByText('API key saved successfully!')).toBeInTheDocument();
    
    // Wait for status message to clear
    await waitFor(() => {
      expect(screen.queryByText('API key saved successfully!')).not.toBeInTheDocument();
    }, { timeout: 4000 });
  });
});