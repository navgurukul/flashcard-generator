import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMemory } from '../hooks/useMemory';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { topics, deleteTopic } = useMemory();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDeleteTopic = (e, topicId) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this topic?')) {
      deleteTopic(topicId);
    }
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <button 
        className="sidebar-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '◀' : '▶'}
      </button>
      
      <div className="sidebar-content">
        <div className="user-section">
          <Link to="/profile" className="user-avatar">
            <div className="avatar-icon">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            {isExpanded && (
              <div className="user-info">
                <div className="user-email">{user?.email}</div>
              </div>
            )}
          </Link>
          
          {isExpanded && (
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          )}
        </div>
        
        {isExpanded && (
          <div className="topics-section">
            <h3>Previous Topics</h3>
            <div className="topics-list">
              {topics.length === 0 ? (
                <p className="no-topics">No topics yet</p>
              ) : (
                topics.map((topic) => (
                  <div key={topic.id} className="topic-item">
                    <Link to={`/topic/${topic.id}`} className="topic-link">
                      <div className="topic-name">{topic.name}</div>
                      <div className="topic-meta">
                        {topic.flashcardCount} cards • {new Date(topic.createdAt).toLocaleDateString()}
                      </div>
                    </Link>
                    <button 
                      className="delete-topic-btn"
                      onClick={(e) => handleDeleteTopic(e, topic.id)}
                      title="Delete topic"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};