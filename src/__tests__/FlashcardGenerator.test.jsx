import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FlashcardGenerator } from '../components/FlashcardGenerator';

// Mock the hooks
const mockGetApiKey = vi.fn(() => 'test-api-key');
const mockGenerateFlashcards = vi.fn();

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

describe('FlashcardGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders generator section correctly', () => {
    render(<FlashcardGenerator />);
    
    expect(screen.getByRole('heading', { name: 'Generate Flashcards' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter topic/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate Flashcards' })).toBeInTheDocument();
  });

  it('allows user to enter topic', () => {
    render(<FlashcardGenerator />);
    
    const textarea = screen.getByPlaceholderText(/Enter topic/);
    fireEvent.change(textarea, { target: { value: 'Spanish words' } });
    
    expect(textarea.value).toBe('Spanish words');
  });

  it('displays flashcards when available', () => {
    render(<FlashcardGenerator />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hola')).toBeInTheDocument();
    expect(screen.getByText('Goodbye')).toBeInTheDocument();
    expect(screen.getByText('Adiós')).toBeInTheDocument();
  });

  it('calls generateFlashcards when generate button is clicked', () => {
    render(<FlashcardGenerator />);
    
    const textarea = screen.getByPlaceholderText(/Enter topic/);
    const button = screen.getByRole('button', { name: 'Generate Flashcards' });
    
    fireEvent.change(textarea, { target: { value: 'Spanish words' } });
    fireEvent.click(button);
    
    expect(mockGenerateFlashcards).toHaveBeenCalledWith('Spanish words', 'test-api-key');
  });
});

describe('FlashcardComponent', () => {
  it('flips flashcard on click', () => {
    render(<FlashcardGenerator />);
    
    const flashcard = screen.getByText('Hello').closest('.flashcard');
    expect(flashcard).not.toHaveClass('flipped');
    
    fireEvent.click(flashcard);
    expect(flashcard).toHaveClass('flipped');
    
    fireEvent.click(flashcard);
    expect(flashcard).not.toHaveClass('flipped');
  });
});