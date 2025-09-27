import { AuthContext, useAuthState } from '../../hooks/useAuth';

export const AuthProvider = ({ children }) => {
  const value = useAuthState();

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};