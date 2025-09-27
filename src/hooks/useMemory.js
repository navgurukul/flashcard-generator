import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useMemory = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [flashcardsByTopic, setFlashcardsByTopic] = useState({});

  // Load user data from localStorage when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Clear data when no user
      setTopics([]);
      setFlashcardsByTopic({});
    }
  }, [user]);

  const getUserKey = (suffix) => {
    return user ? `user_${user.userId}_${suffix}` : null;
  };

  const loadUserData = () => {
    if (!user) return;
    
    const topicsKey = getUserKey('topics');
    const flashcardsKey = getUserKey('flashcards');
    
    const savedTopics = localStorage.getItem(topicsKey);
    const savedFlashcards = localStorage.getItem(flashcardsKey);
    
    if (savedTopics) {
      setTopics(JSON.parse(savedTopics));
    }
    
    if (savedFlashcards) {
      setFlashcardsByTopic(JSON.parse(savedFlashcards));
    }
  };

  const saveUserData = (newTopics, newFlashcards) => {
    if (!user) return;
    
    const topicsKey = getUserKey('topics');
    const flashcardsKey = getUserKey('flashcards');
    
    localStorage.setItem(topicsKey, JSON.stringify(newTopics));
    localStorage.setItem(flashcardsKey, JSON.stringify(newFlashcards));
  };

  const addTopic = (topicName, flashcards) => {
    if (!user || !topicName.trim()) return;
    
    const newTopic = {
      id: Date.now().toString(),
      name: topicName.trim(),
      createdAt: new Date().toISOString(),
      flashcardCount: flashcards.length
    };
    
    // Remove existing topic with same name if it exists
    const filteredTopics = topics.filter(t => t.name.toLowerCase() !== topicName.toLowerCase());
    const newTopics = [newTopic, ...filteredTopics];
    
    const newFlashcards = {
      ...flashcardsByTopic,
      [newTopic.id]: flashcards
    };
    
    setTopics(newTopics);
    setFlashcardsByTopic(newFlashcards);
    saveUserData(newTopics, newFlashcards);
    
    return newTopic.id;
  };

  const getTopicFlashcards = (topicId) => {
    return flashcardsByTopic[topicId] || [];
  };

  const deleteTopic = (topicId) => {
    const newTopics = topics.filter(t => t.id !== topicId);
    const newFlashcards = { ...flashcardsByTopic };
    delete newFlashcards[topicId];
    
    setTopics(newTopics);
    setFlashcardsByTopic(newFlashcards);
    saveUserData(newTopics, newFlashcards);
  };

  const getUserStats = () => {
    if (!user) return { topicsExplored: 0, totalFlashcards: 0 };
    
    const totalFlashcards = Object.values(flashcardsByTopic).reduce(
      (total, cards) => total + cards.length, 
      0
    );
    
    return {
      topicsExplored: topics.length,
      totalFlashcards
    };
  };

  return {
    topics,
    addTopic,
    getTopicFlashcards,
    deleteTopic,
    getUserStats,
    hasTopics: topics.length > 0
  };
};