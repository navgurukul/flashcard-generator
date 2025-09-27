import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMemory } from '../hooks/useMemory';

export const UserProfile = () => {
  const { user, login } = useAuth();
  const { getUserStats } = useMemory();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const stats = getUserStats();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Update user data in mock authentication
      const updatedUser = {
        ...user,
        email: email,
        username: email.split('@')[0]
      };
      
      login(updatedUser);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <Link to="/" className="back-link">← Back to Flashcards</Link>
        <h1>User Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Profile Information</h2>
          
          <div className="avatar-section">
            <div className="avatar-large">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          {!isEditing ? (
            <div className="profile-display">
              <div className="profile-field">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="profile-field">
                <label>Username:</label>
                <span>{user?.username}</span>
              </div>
              <button 
                className="edit-btn"
                onClick={() => {
                  setIsEditing(true);
                  setEmail(user?.email || '');
                }}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-edit-form">
              <div className="input-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditing(false);
                    setError('');
                    setMessage('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-section">
          <h2>User Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.topicsExplored}</div>
              <div className="stat-label">Topics Explored</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.totalFlashcards}</div>
              <div className="stat-label">Total Flashcards</div>
            </div>
          </div>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};