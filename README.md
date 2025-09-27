# Flashcard Generator

Instantly create interactive flashcards for any topic with the power of Gemini! Learn smarter, not harder.

![Flashcard Generator Screenshot](https://github.com/user-attachments/assets/2b33e1de-64fd-4911-9f2e-1cd77aded885)

## Features

- 🤖 **AI-Powered**: Generate flashcards using Google's Gemini API
- 🔄 **Interactive**: Click to flip cards and reveal definitions
- 🎨 **Modern UI**: Clean, responsive design with light/dark theme support
- 💾 **Persistent Storage**: API key saved securely in localStorage
- 📱 **Mobile Friendly**: Works seamlessly on all devices
- ⚡ **Fast**: Built with Vite for lightning-fast development and optimized builds

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/navgurukul/flashcard-generator.git
   cd flashcard-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Enter your Gemini API key
   - Start creating flashcards!

## Usage

1. **Set up API Key**: Enter your Gemini API key in the settings section
2. **Enter Content**: Type a topic (e.g., "Spanish Basics") or direct term:definition pairs
3. **Generate**: Click "Generate Flashcards" to create your study set
4. **Study**: Click any flashcard to flip between term and definition

### Input Formats

**Topic-based generation:**
```
Spanish Basics
```

**Direct term:definition pairs:**
```
Hello: Hola
Goodbye: Adiós
Thank you: Gracias
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run test suite
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── App.jsx         # Main application
│   ├── ApiKeySection.jsx
│   └── FlashcardGenerator.jsx
├── hooks/              # Custom React hooks
│   ├── useApiKey.js
│   └── useFlashcards.js
├── __tests__/          # Test files
└── assets/             # Static assets
```

### Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test ApiKeySection.test.jsx
```

## Deployment

### AWS Amplify

The project is configured for AWS Amplify deployment:

1. Connect your GitHub repository to AWS Amplify
2. The build settings are automatically configured via `amplify.yml`
3. Deploy with a single click!

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the [contribution guidelines](./copilot-instructions.md)
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Update documentation in `docs/updates.md`
7. Submit a pull request

### Code Quality

- **Testing**: Maintain >90% test coverage
- **Linting**: Code must pass ESLint checks
- **Documentation**: Update docs for any changes
- **Performance**: Consider bundle size and runtime performance

## Tech Stack

- **Frontend**: React 19.1.1, Vite 7.1.7
- **Styling**: CSS with custom properties
- **Testing**: Vitest, @testing-library/react
- **AI Integration**: Google Gemini API
- **Deployment**: AWS Amplify
- **CI/CD**: GitHub Actions

## API Integration

This app uses Google's Gemini API to generate flashcards. To get an API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Enter the key in the application settings

**Note**: API keys are stored locally in your browser and never sent to any third-party servers except Google's Gemini API.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.

## Support

- 📖 [Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/navgurukul/flashcard-generator/issues)
- 💬 [Discussions](https://github.com/navgurukul/flashcard-generator/discussions)

---

Made with ❤️ by [NavGurukul](https://navgurukul.org)
