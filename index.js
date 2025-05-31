/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Get DOM elements
const topicInput = document.getElementById('topicInput');
const generateButton = document.getElementById('generateButton');
const flashcardsContainer = document.getElementById('flashcardsContainer');
const errorMessage = document.getElementById('errorMessage');

// API key for Gemini
const API_KEY = 'AIzaSyBz7Lz5UDNXWkdrQOrvOJy0BcZkCqro-Qs';

// Function to generate flashcards
generateButton.addEventListener('click', async () => {
  const topic = topicInput.value.trim();
  if (!topic) {
    errorMessage.textContent = 'Please enter a topic or some terms and definitions.';
    flashcardsContainer.textContent = '';
    return;
  }

  errorMessage.textContent = 'Generating flashcards...';
  flashcardsContainer.textContent = '';
  generateButton.disabled = true; // Disable button during generation

  try {
    const prompt = `Generate a list of flashcards for the topic of "${topic}". Each flashcard should have a term and a concise definition. Format the output as a list of "Term: Definition" pairs, with each pair on a new line. Ensure terms and definitions are distinct and clearly separated by a single colon. Here's an example output:
    Hello: Hola
    Goodbye: Adiós`;
    
    // Direct API URL using fetch instead of the Google GenAI package
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    
    // Extract text from the API response
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (responseText) {
      const flashcards = responseText
        .split('\n')
        // Improved splitting and filtering
        .map((line) => {
          const parts = line.split(':');
          // Ensure there's a term and at least one part for definition
          if (parts.length >= 2 && parts[0].trim()) {
            const term = parts[0].trim();
            const definition = parts.slice(1).join(':').trim(); // Join remaining parts for definition
            if (definition) {
              return {term, definition};
            }
          }
          return null; // Return null for invalid lines
        })
        .filter(card => card !== null); // Filter out nulls

      if (flashcards.length > 0) {
        errorMessage.textContent = '';
        flashcards.forEach((flashcard, index) => {
          // Create card structure for flipping
          const cardDiv = document.createElement('div');
          cardDiv.classList.add('flashcard');
          cardDiv.dataset.index = index.toString();

          const cardInner = document.createElement('div');
          cardInner.classList.add('flashcard-inner');

          const cardFront = document.createElement('div');
          cardFront.classList.add('flashcard-front');

          const termDiv = document.createElement('div');
          termDiv.classList.add('term');
          termDiv.textContent = flashcard.term;

          const cardBack = document.createElement('div');
          cardBack.classList.add('flashcard-back');

          const definitionDiv = document.createElement('div');
          definitionDiv.classList.add('definition');
          definitionDiv.textContent = flashcard.definition;

          cardFront.appendChild(termDiv);
          cardBack.appendChild(definitionDiv);
          cardInner.appendChild(cardFront);
          cardInner.appendChild(cardBack);
          cardDiv.appendChild(cardInner);

          flashcardsContainer.appendChild(cardDiv);

          // Add click listener to toggle the 'flipped' class
          cardDiv.addEventListener('click', () => {
            cardDiv.classList.toggle('flipped');
          });
        });
      } else {
        errorMessage.textContent = 'No valid flashcards could be generated from the response. Please check the format.';
      }
    } else {
      errorMessage.textContent = 'Failed to generate flashcards or received an empty response. Please try again.';
    }
  } catch (error) {
    console.error('Error generating content:', error);
    const detailedError = error.message || 'An unknown error occurred';
    errorMessage.textContent = `An error occurred: ${detailedError}`;
    flashcardsContainer.textContent = ''; // Clear cards on error
  } finally {
    generateButton.disabled = false; // Re-enable button
  }
});