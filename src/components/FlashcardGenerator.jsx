import { useState } from 'react';
import { useApiKey } from '../hooks/useApiKey';
import { useFlashcards } from '../hooks/useFlashcards';

export const FlashcardGenerator = () => {
  const [topic, setTopic] = useState('');
  const { getApiKey } = useApiKey();
  const { flashcards, isGenerating, error, generateFlashcards } = useFlashcards();

  const handleGenerate = () => {
    const apiKey = getApiKey();
    generateFlashcards(topic, apiKey);
  };

  return (
    <div id="generatorSection">
      <h2>Generate Flashcards</h2>
      <textarea
        id="topicInput"
        placeholder="Enter topic (e.g., Ancient Rome) or 'Term: Definition' pairs (one per line)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button 
        id="generateButton" 
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Flashcards'}
      </button>
      <div className="error-message">
        {error}
      </div>
      <div className="flashcards-container">
        {flashcards.map((flashcard, index) => (
          <FlashcardComponent key={index} flashcard={flashcard} index={index} />
        ))}
      </div>
    </div>
  );
};

const FlashcardComponent = ({ flashcard, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
      onClick={handleClick}
      data-index={index}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="term">{flashcard.term}</div>
        </div>
        <div className="flashcard-back">
          <div className="definition">{flashcard.definition}</div>
        </div>
      </div>
    </div>
  );
};