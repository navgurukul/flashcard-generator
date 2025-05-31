import {GoogleGenAI} from '@google/genai';

const topicInput = document.getElementById('topicInput');
const generateButton = document.getElementById('generateButton');
const flashcardsContainer = document.getElementById('flashcardsContainer');
const errorMessage = document.getElementById('errorMessage');

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

generateButton.addEventListener('click', async () => {
  const topic = topicInput.value.trim();
  if (!topic) {
    errorMessage.textContent =
      'Please enter a topic or some terms and definitions.';
    flashcardsContainer.textContent = '';
    return;
  }

  errorMessage.textContent = 'Generating flashcards...';
  flashcardsContainer.textContent = '';
  generateButton.disabled = true;

  try {
    const prompt = `Generate a list of flashcards for the topic of "${topic}". Each flashcard should have a term and a concise definition. Format the output as a list of "Term: Definition" pairs, with each pair on a new line. Ensure terms and definitions are distinct and clearly separated by a single colon. Here's an example output:\nHello: Hola\nGoodbye: Adiós`;
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });
    const responseText = result && result.text ? result.text : '';

    if (responseText) {
      const flashcards = responseText
        .split('\n')
        .map((line) => {
          const parts = line.split(':');
          if (parts.length >= 2 && parts[0].trim()) {
            const term = parts[0].trim();
            const definition = parts.slice(1).join(':').trim();
            if (definition) {
              return {term, definition};
            }
          }
          return null;
        })
        .filter((card) => card !== null);

      if (flashcards.length > 0) {
        errorMessage.textContent = '';
        flashcards.forEach((flashcard, index) => {
          const cardDiv = document.createElement('div');
          cardDiv.classList.add('flashcard');
          cardDiv.dataset['index'] = index.toString();

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

          cardDiv.addEventListener('click', () => {
            cardDiv.classList.toggle('flipped');
          });
        });
      } else {
        errorMessage.textContent =
          'No valid flashcards could be generated from the response. Please check the format.';
      }
    } else {
      errorMessage.textContent =
        'Failed to generate flashcards or received an empty response. Please try again.';
    }
  } catch (error) {
    console.error('Error generating content:', error);
    const detailedError = error && error.message ? error.message : 'An unknown error occurred';
    errorMessage.textContent = `An error occurred: ${detailedError}`;
    flashcardsContainer.textContent = '';
  } finally {
    generateButton.disabled = false;
  }
});
