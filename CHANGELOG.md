# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **LLM Service Architecture**: Extracted LLM functionality into a pluggable service architecture
  - `LLMService` abstract base class for all LLM implementations
  - `GeminiLLMService` implementation maintaining existing Gemini API functionality
  - `LLMServiceFactory` for creating pluggable LLM service instances
  - Centralized LLM configuration system in `src/config/llm.js`
  - Comprehensive test suite for all LLM services
  - Documentation for adding new LLM providers

### Changed
- **Refactored useFlashcards hook**: Now uses the new LLM service architecture instead of direct API calls
- **Improved error handling**: Better error messages and consistent error handling across LLM services
- **Enhanced testability**: All LLM interactions now properly mocked and tested

### Technical Details
- All LLM services return responses in Gemini multimodal format (with parts) for consistency
- The service architecture is designed to support multiple LLM providers while maintaining the same interface
- Configuration system allows easy switching between different LLM providers and models
- Full backward compatibility maintained - existing functionality works exactly the same

### Files Added
- `src/services/llm/LLMService.js`
- `src/services/llm/GeminiLLMService.js`
- `src/services/llm/LLMServiceFactory.js`
- `src/services/llm/index.js`
- `src/services/index.js`
- `src/config/llm.js`
- `src/__tests__/services/llm/GeminiLLMService.test.js`
- `src/__tests__/services/llm/LLMServiceFactory.test.js`
- `src/__tests__/config/llm.test.js`
- `docs/adding-llm-providers.md`
- `src/services/README.md`

### Files Modified
- `src/hooks/useFlashcards.js` - Updated to use new LLM service architecture