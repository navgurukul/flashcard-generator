/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiKeySection } from './components/ApiKeySection';
import { FlashcardGenerator } from './components/FlashcardGenerator';
import { DarkModeToggle } from './components/DarkModeToggle';
import './components/App.css';

function App() {
  return (
    <>
      <DarkModeToggle />
      <div className="container">
        <h1>Flashcard Generator</h1>
        <p>
          Enter a topic or a list of terms and definitions to generate flashcards using the Gemini API.
        </p>
        
        <ApiKeySection />
        <FlashcardGenerator />
      </div>
    </>
  );
}

export default App;
