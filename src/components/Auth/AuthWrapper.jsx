import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from './LoginForm';

export const AuthWrapper = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return children;
};