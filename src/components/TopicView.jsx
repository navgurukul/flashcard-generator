import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMemory } from '../hooks/useMemory';

export const TopicView = () => {
  const { topicId } = useParams();
  const { topics, getTopicFlashcards } = useMemory();
  const [topic, setTopic] = useState(null);
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    const foundTopic = topics.find(t => t.id === topicId);
    if (foundTopic) {
      setTopic(foundTopic);
      setFlashcards(getTopicFlashcards(topicId));
    }
  }, [topicId, topics, getTopicFlashcards]);

  if (!topic) {
    return (
      <div className="topic-view">
        <div className="topic-header">
          <Link to="/" className="back-link">← Back to Generator</Link>
          <h1>Topic not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="topic-view">
      <div className="topic-header">
        <Link to="/" className="back-link">← Back to Generator</Link>
        <h1>{topic.name}</h1>
        <div className="topic-meta">
          {flashcards.length} flashcards • Created {new Date(topic.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="topic-flashcards">
        {flashcards.length === 0 ? (
          <p>No flashcards found for this topic.</p>
        ) : (
          <div className="flashcards-container">
            {flashcards.map((flashcard, index) => (
              <FlashcardComponent 
                key={index} 
                flashcard={flashcard} 
                index={index} 
              />
            ))}
          </div>
        )}
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