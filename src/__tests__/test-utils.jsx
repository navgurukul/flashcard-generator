import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../components/Auth/AuthProvider';

// Custom render function that includes providers
export const renderWithProviders = (ui, options = {}) => {
  function Wrapper({ children }) {
    return (
      <AuthProvider>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </AuthProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
};

// Custom render for components that don't need routing
export const renderWithAuth = (ui, options = {}) => {
  function Wrapper({ children }) {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock user for testing
export const mockUser = {
  username: 'testuser',
  email: 'test@example.com',
  userId: 'test_user_123'
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';