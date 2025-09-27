/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthProvider';
import { AuthWrapper } from './components/Auth/AuthWrapper';
import { ApiKeySection } from './components/ApiKeySection';
import { FlashcardGenerator } from './components/FlashcardGenerator';
import { DarkModeToggle } from './components/DarkModeToggle';
import { Sidebar } from './components/Sidebar';
import { UserProfile } from './components/UserProfile';
import { TopicView } from './components/TopicView';
import './components/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthWrapper>
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <DarkModeToggle />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/topic/:topicId" element={<TopicView />} />
              </Routes>
            </div>
          </div>
        </AuthWrapper>
      </Router>
    </AuthProvider>
  );
}

const HomePage = () => {
  return (
    <div className="container">
      <h1>Flashcard Generator</h1>
      <p>
        Enter a topic or a list of terms and definitions to generate flashcards using the Gemini API.
      </p>
      
      <ApiKeySection />
      <FlashcardGenerator />
    </div>
  );
};

export default App;
