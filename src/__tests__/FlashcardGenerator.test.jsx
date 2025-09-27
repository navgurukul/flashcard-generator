import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithAuth, mockUser } from './test-utils';
import { FlashcardGenerator } from '../components/FlashcardGenerator';
import * as useAuthModule from '../hooks/useAuth';

// Mock the hooks
const mockGetApiKey = vi.fn(() => 'test-api-key');
const mockGenerateFlashcards = vi.fn();
const mockAddTopic = vi.fn();

vi.mock('../hooks/useApiKey', () => ({
  useApiKey: () => ({
    getApiKey: mockGetApiKey
  })
}));

vi.mock('../hooks/useFlashcards', () => ({
  useFlashcards: () => ({
    flashcards: [
      { term: 'Hello', definition: 'Hola' },
      { term: 'Goodbye', definition: 'Adiós' }
    ],
    isGenerating: false,
    error: '',
    generateFlashcards: mockGenerateFlashcards,
    isCompleted: vi.fn(() => false),
    markAsCompleted: vi.fn()
  })
}));

vi.mock('../hooks/useMemory', () => ({
  useMemory: () => ({
    addTopic: mockAddTopic
  })
}));

vi.mock('../hooks/useAuth', async () => {
  const actual = await vi.importActual('../hooks/useAuth');
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

describe('FlashcardGenerator', () => {
  beforeEach(() => {
    // Mock authenticated user
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      logout: vi.fn(),
      login: vi.fn(),
      checkUser: vi.fn()
    });
    vi.clearAllMocks();
  });

  it('renders generator section correctly', () => {
    renderWithAuth(<FlashcardGenerator />);
    
    expect(screen.getByRole('heading', { name: 'Generate Flashcards' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter topic/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate Flashcards' })).toBeInTheDocument();
  });

  it('allows user to enter topic', () => {
    renderWithAuth(<FlashcardGenerator />);
    
    const textarea = screen.getByPlaceholderText(/Enter topic/);
    fireEvent.change(textarea, { target: { value: 'Spanish words' } });
    
    expect(textarea.value).toBe('Spanish words');
  });

  it('displays flashcards when available', () => {
    renderWithAuth(<FlashcardGenerator />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hola')).toBeInTheDocument();
    expect(screen.getByText('Goodbye')).toBeInTheDocument();
    expect(screen.getByText('Adiós')).toBeInTheDocument();
  });

  it('calls generateFlashcards when generate button is clicked', () => {
    renderWithAuth(<FlashcardGenerator />);
    
    const textarea = screen.getByPlaceholderText(/Enter topic/);
    const button = screen.getByRole('button', { name: 'Generate Flashcards' });
    
    fireEvent.change(textarea, { target: { value: 'Spanish words' } });
    fireEvent.click(button);
    
    expect(mockGenerateFlashcards).toHaveBeenCalledWith('Spanish words', 'test-api-key');
  });
});

describe('FlashcardComponent', () => {
  it('flips flashcard on click', () => {
    renderWithAuth(<FlashcardGenerator />);
    
    const flashcard = screen.getByText('Hello').closest('.flashcard');
    expect(flashcard).not.toHaveClass('flipped');
    
    fireEvent.click(flashcard);
    expect(flashcard).toHaveClass('flipped');
    
    fireEvent.click(flashcard);
    expect(flashcard).not.toHaveClass('flipped');
  });
});