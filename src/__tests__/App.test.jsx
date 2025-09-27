import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Flashcard Generator')).toBeInTheDocument();
  });

  it('displays the main title and description', () => {
    render(<App />);
    expect(screen.getByText('Flashcard Generator')).toBeInTheDocument();
    expect(screen.getByText(/Enter a topic or a list of terms and definitions/)).toBeInTheDocument();
  });

  it('renders API key section', () => {
    render(<App />);
    expect(screen.getByText('API Key Settings')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Gemini API key')).toBeInTheDocument();
  });

  it('renders flashcard generator section', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Generate Flashcards' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate Flashcards' })).toBeInTheDocument();
  });
});