import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithAuth, mockUser } from './test-utils';
import App from '../App';
import * as useAuthModule from '../hooks/useAuth';

// Mock the auth hook to simulate authenticated state
vi.mock('../hooks/useAuth', async () => {
  const actual = await vi.importActual('../hooks/useAuth');
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

describe('App', () => {
  beforeEach(() => {
    // Mock authenticated user
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      logout: vi.fn(),
      login: vi.fn(),
      checkUser: vi.fn()
    });
  });

  it('renders without crashing', () => {
    renderWithAuth(<App />);
    expect(screen.getByText('Flashcard Generator')).toBeInTheDocument();
  });

  it('displays the main title and description', () => {
    renderWithAuth(<App />);
    expect(screen.getByText('Flashcard Generator')).toBeInTheDocument();
    expect(screen.getByText(/Enter a topic or a list of terms and definitions/)).toBeInTheDocument();
  });

  it('renders API key section', () => {
    renderWithAuth(<App />);
    expect(screen.getByText('API Key Settings')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Gemini API key')).toBeInTheDocument();
  });

  it('renders flashcard generator section', () => {
    renderWithAuth(<App />);
    expect(screen.getByRole('heading', { name: 'Generate Flashcards' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate Flashcards' })).toBeInTheDocument();
  });
});