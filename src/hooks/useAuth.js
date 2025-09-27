import { useState, useEffect, createContext, useContext } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signOut, getCurrentUser } from 'aws-amplify/auth';
import amplifyconfig from '../amplifyconfiguration.json';

// Configure Amplify
Amplify.configure(amplifyconfig);

// Create Auth Context
const AuthContext = createContext();

// Auth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// For now, we'll implement a simple auth state without Amplify backend
export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // For demo purposes, check localStorage for mock user
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log('No authenticated user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      // Clear localStorage on logout except for API key
      const apiKey = localStorage.getItem('gemini_api_key');
      localStorage.clear();
      if (apiKey) {
        localStorage.setItem('gemini_api_key', apiKey);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('mockUser', JSON.stringify(userData));
  };

  return {
    user,
    loading,
    logout,
    login,
    checkUser
  };
};

export { AuthContext };