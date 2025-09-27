import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm = ({ onAuthSuccess }) => {
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mock authentication - in a real app, this would call your auth service
      if (email.includes('@') && password.length >= 6) {
        const userData = {
          username: email.split('@')[0],
          email: email,
          userId: `user_${Date.now()}`
        };
        login(userData);
        onAuthSuccess?.();
      } else {
        throw new Error('Please enter a valid email and password (min 6 characters)');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mock sign up - in a real app, this would call your auth service
      if (email.includes('@') && password.length >= 6) {
        const userData = {
          username: email.split('@')[0],
          email: email,
          userId: `user_${Date.now()}`
        };
        login(userData);
        onAuthSuccess?.();
      } else {
        throw new Error('Please enter a valid email and password (min 6 characters)');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Demo mode: Use any email and password (6+ characters)
        </p>
        
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        
        <p>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            type="button" 
            className="link-button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};