# Services

This directory contains service implementations for external integrations.

## LLM Services

The `llm/` directory contains the pluggable LLM service architecture:

- **LLMService.js** - Abstract base class for all LLM implementations
- **GeminiLLMService.js** - Google Gemini API implementation
- **LLMServiceFactory.js** - Factory for creating LLM service instances
- **index.js** - Exports for easy importing

### Key Features

- **Pluggable Architecture**: Easy to add new LLM providers
- **Consistent Response Format**: All services return Gemini multimodal format
- **Configuration Support**: Centralized configuration system
- **Comprehensive Testing**: Full test coverage for all services

### Usage

```javascript
import { LLMServiceFactory } from '../services/llm';

// Create a service instance
const llmService = LLMServiceFactory.createService('gemini', apiKey);

// Generate content
const response = await llmService.generate(prompt);

// Extract text from standardized response format
const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
```

For detailed information on adding new LLM providers, see [docs/adding-llm-providers.md](../../docs/adding-llm-providers.md).