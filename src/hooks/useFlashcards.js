import { useState, useEffect } from 'react';

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [completedFlashcards, setCompletedFlashcards] = useState(() => {
    // Load completed flashcards from localStorage
    const saved = localStorage.getItem('completedFlashcards');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Save completed flashcards to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('completedFlashcards', JSON.stringify([...completedFlashcards]));
  }, [completedFlashcards]);

  const parseFlashcardsFromText = (responseText) => {
    return responseText
      .split('\n')
      .map((line) => {
        const parts = line.split(':');
        // Ensure there's a term and at least one part for definition
        if (parts.length >= 2 && parts[0].trim()) {
          const term = parts[0].trim();
          const definition = parts.slice(1).join(':').trim(); // Join remaining parts for definition
          if (definition) {
            return { term, definition };
          }
        }
        return null; // Return null for invalid lines
      })
      .filter(card => card !== null); // Filter out nulls
  };

  const generateFlashcards = async (topic, apiKey) => {
    if (!topic.trim()) {
      setError('Please enter a topic or some terms and definitions.');
      return;
    }

    if (!apiKey) {
      setError('Please enter your Gemini API key.');
      return;
    }

    setIsGenerating(true);
    setError('Generating flashcards...');
    setFlashcards([]);

    try {
      const prompt = `Generate a list of flashcards for the topic of "${topic}". Each flashcard should have a term and a concise definition. Format the output as a list of "Term: Definition" pairs, with each pair on a new line. Ensure terms and definitions are distinct and clearly separated by a single colon. Here's an example output:
    Hello: Hola
    Goodbye: Adiós`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      });

      const data = await response.json();

      // Extract text from the API response
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (responseText) {
        const parsedFlashcards = parseFlashcardsFromText(responseText);

        if (parsedFlashcards.length > 0) {
          setFlashcards(parsedFlashcards);
          setError('');
        } else {
          setError('No valid flashcards could be generated from the response. Please check the format.');
        }
      } else {
        setError('Failed to generate flashcards or received an empty response. Please try again.');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      const detailedError = error.message || 'An unknown error occurred';
      setError(`An error occurred: ${detailedError}`);
      setFlashcards([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearFlashcards = () => {
    setFlashcards([]);
    setError('');
  };

  // Generate a unique ID for each flashcard based on term and definition
  const getFlashcardId = (flashcard) => {
    return `${flashcard.term}:${flashcard.definition}`;
  };

  const markAsCompleted = (flashcard) => {
    const id = getFlashcardId(flashcard);
    setCompletedFlashcards(prev => new Set([...prev, id]));
  };

  const isCompleted = (flashcard) => {
    const id = getFlashcardId(flashcard);
    return completedFlashcards.has(id);
  };

  return {
    flashcards,
    isGenerating,
    error,
    generateFlashcards,
    clearFlashcards,
    markAsCompleted,
    isCompleted
  };
};
