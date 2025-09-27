/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Get DOM elements
const topicInput = document.getElementById('topicInput');
const generateButton = document.getElementById('generateButton');
const flashcardsContainer = document.getElementById('flashcardsContainer');
const errorMessage = document.getElementById('errorMessage');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
const apiKeyStatus = document.getElementById('apiKeyStatus');
const toggleVisibilityBtn = document.getElementById('toggleVisibilityBtn');

// Function to get API key - either from input or localStorage
function getApiKey() {
  // Try to get from input field
  const inputKey = apiKeyInput?.value?.trim();

  // If input has a value, save it to localStorage and return it
  if (inputKey) {
    localStorage.setItem('gemini_api_key', inputKey);
    return inputKey;
  }

  // Otherwise try to get from localStorage
  const savedKey = localStorage.getItem('gemini_api_key');

  // If we have a saved key, populate the input field and return it
  if (savedKey && apiKeyInput) {
    apiKeyInput.value = savedKey;
    return savedKey;
  }

  return ''; // Return empty string if no key is found
}

// Function to generate flashcards
generateButton.addEventListener('click', async () => {
  const topic = topicInput.value.trim();
  if (!topic) {
    errorMessage.textContent = 'Please enter a topic or some terms and definitions.';
    flashcardsContainer.textContent = '';
    return;
  }

  // Get API key
  const API_KEY = getApiKey();
  if (!API_KEY) {
    errorMessage.textContent = 'Please enter your Gemini API key.';
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
              return { term, definition };
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


          const doneCircleElement = document.createElement('div');
          doneCircleElement.classList.add('done-circle');
          doneCircleElement.title = 'Mark as done';

          const checkIconElement = document.createElement('i');
          checkIconElement.classList.add('fa-solid', 'fa-check');
          checkIconElement.style.color = 'white';
          checkIconElement.style.display = 'none';

          doneCircleElement.appendChild(checkIconElement);



          doneCircleElement.addEventListener('click', e => {
            e.stopPropagation();

            const isDone = checkIconElement.style.display === 'block';

            if (isDone) {
              doneCircleElement.style.backgroundColor = '';
              checkIconElement.style.display = 'none';
              cardElement.style.borderColor = '';
            } else {
              doneCircleElement.style.backgroundColor = '#28a745';
              checkIconElement.style.display = 'block';
              cardElement.style.borderColor = '#28a745';
            }
          });



          cardFront.appendChild(termDiv);
          cardBack.appendChild(definitionDiv);
          cardInner.appendChild(cardFront);
          cardInner.appendChild(cardBack);
          cardDiv.appendChild(cardInner);
          cardFront.appendChild(doneCircleElement);


          flashcardsContainer.appendChild(cardDiv);

          // No per-card click listener; handled by event delegation below

















        });
        // Add event delegation for flipping cards
        flashcardsContainer.addEventListener('click', function(e) {
          // Find the closest .flashcard ancestor of the click target
          const cardDiv = e.target.closest('.flashcard');
          // Ignore clicks outside a card
          if (!cardDiv || !flashcardsContainer.contains(cardDiv)) return;
          // Remove 'flipped' from all other cards
          const allCards = flashcardsContainer.querySelectorAll('.flashcard');
          allCards.forEach(card => {
            if (card !== cardDiv) {
              card.classList.remove('flipped');
            }
          });
          // Toggle 'flipped' on the clicked card
          cardDiv.classList.toggle('flipped');
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

// Save API key button functionality
saveApiKeyBtn.addEventListener('click', () => {
  const apiKey = getApiKey();
  if (apiKey) {
    apiKeyStatus.textContent = 'API key saved successfully!';
    apiKeyStatus.classList.add('success');
  } else {
    apiKeyStatus.textContent = 'Failed to save API key. Please try again.';
    apiKeyStatus.classList.remove('success');
  }

  // Hide status message after 3 seconds
  setTimeout(() => {
    apiKeyStatus.textContent = '';
    apiKeyStatus.classList.remove('success');
  }, 3000);
});

// Toggle API key visibility
toggleVisibilityBtn.addEventListener('click', () => {
  const type = apiKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
  apiKeyInput.setAttribute('type', type);
  toggleVisibilityBtn.textContent = type === 'password' ? 'Show' : 'Hide';
});