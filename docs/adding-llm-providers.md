# Adding New LLM Providers

This document explains how to add support for new LLM providers to the Flashcard Generator application.

## Architecture Overview

The LLM service architecture uses a pluggable design pattern with the following components:

- **LLMService** - Abstract base class that defines the interface
- **Provider Implementations** - Concrete implementations for specific LLM providers (e.g., GeminiLLMService)
- **LLMServiceFactory** - Factory class for creating service instances
- **Configuration** - Centralized configuration for all providers

## Adding a New Provider

### Step 1: Create the Service Implementation

Create a new service class that extends `LLMService`:

```javascript
// src/services/llm/OpenAILLMService.js
import { LLMService } from './LLMService.js';

export class OpenAILLMService extends LLMService {
  constructor(apiKey, model = 'gpt-4') {
    super(apiKey);
    this.model = model;
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async generate(prompt) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key is not configured');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert OpenAI response to Gemini multimodal format
    return {
      candidates: [{
        content: {
          parts: [{
            text: data.choices[0].message.content
          }]
        }
      }]
    };
  }

  getServiceName() {
    return 'openai';
  }

  getModel() {
    return this.model;
  }
}
```

### Step 2: Update the Factory

Add the new service to the factory:

```javascript
// src/services/llm/LLMServiceFactory.js
import { OpenAILLMService } from './OpenAILLMService.js';

export class LLMServiceFactory {
  static SERVICE_TYPES = {
    GEMINI: 'gemini',
    OPENAI: 'openai' // Add new service type
  };

  static createService(serviceType, apiKey, options = {}) {
    switch (serviceType) {
      case LLMServiceFactory.SERVICE_TYPES.GEMINI:
        return new GeminiLLMService(apiKey, options.model);
      
      case LLMServiceFactory.SERVICE_TYPES.OPENAI:
        return new OpenAILLMService(apiKey, options.model);
      
      default:
        throw new Error(`Unsupported LLM service type: ${serviceType}`);
    }
  }
}
```

### Step 3: Update Configuration

Add the service to the configuration:

```javascript
// src/config/llm.js
export const LLM_CONFIG = {
  DEFAULT_SERVICE: 'gemini',
  
  SERVICES: {
    gemini: {
      name: 'Google Gemini',
      type: 'gemini',
      defaultModel: 'gemini-2.0-flash',
      availableModels: ['gemini-2.0-flash', 'gemini-1.5-pro'],
      description: 'Google\'s multimodal AI model'
    },
    openai: {
      name: 'OpenAI GPT',
      type: 'openai',
      defaultModel: 'gpt-4',
      availableModels: ['gpt-4', 'gpt-3.5-turbo'],
      description: 'OpenAI\'s language models'
    }
  }
};
```

### Step 4: Export the New Service

Update the service index file:

```javascript
// src/services/llm/index.js
export { LLMService } from './LLMService.js';
export { GeminiLLMService } from './GeminiLLMService.js';
export { OpenAILLMService } from './OpenAILLMService.js';
export { LLMServiceFactory } from './LLMServiceFactory.js';
```

### Step 5: Add Tests

Create comprehensive tests for the new service:

```javascript
// src/__tests__/services/llm/OpenAILLMService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAILLMService } from '../../../services/llm/OpenAILLMService.js';

describe('OpenAILLMService', () => {
  // Add comprehensive tests covering all scenarios
});
```

## Important Requirements

### Response Format

**All LLM services must return responses in Gemini multimodal format:**

```javascript
{
  candidates: [{
    content: {
      parts: [{
        text: "Generated response text"
      }]
    }
  }]
}
```

This ensures consistency across different providers and maintains compatibility with the existing flashcard parsing logic.

### Error Handling

- Services should throw descriptive errors for configuration issues
- Network errors should be propagated with context
- API-specific errors should be converted to user-friendly messages

### Testing

- Test all public methods
- Mock external API calls
- Test error scenarios
- Ensure response format compliance

## Usage

Once implemented, users can specify the LLM provider:

```javascript
// In useFlashcards hook
const generateFlashcards = async (topic, apiKey, serviceType = 'openai') => {
  // Service will be created automatically based on serviceType
};
```

## Future Enhancements

Consider adding support for:
- Model selection UI
- Provider-specific configuration options
- Rate limiting and retry logic
- Response caching
- Provider health checks