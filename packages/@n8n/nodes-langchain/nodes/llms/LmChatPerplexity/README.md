# Perplexity AI Integration

This directory contains the Perplexity AI integration for n8n's LangChain nodes.

## Files

- `LmChatPerplexity.node.ts` - The main LLM chat node implementation
- `perplexity.svg` - Icon for the Perplexity node
- `__tests__/` - Unit tests for the node

## Features

- **Real-time web search**: Perplexity's Sonar models provide access to real-time web information
- **Multiple model support**: Supports various Perplexity models including reasoning and online variants
- **OpenAI-compatible API**: Uses the `@langchain/openai` package with Perplexity's API endpoint
- **Standard LLM parameters**: Temperature, max tokens, top-p, frequency/presence penalties
- **Integration with n8n ecosystem**: Full compatibility with n8n's tracing and error handling

## Usage

1. Create Perplexity AI credentials with your API key
2. Add the Perplexity AI Chat Model node to your workflow
3. Select your desired model (e.g., `llama-3.1-sonar-small-128k-online`)
4. Configure parameters as needed
5. Connect to other AI nodes in your workflow

## Available Models

Perplexity offers several model types:
- **Online models** (`*-online`): Include real-time web search
- **Chat models**: Standard conversational models
- **Reasoning models** (`*-reasoning`): Advanced reasoning capabilities

## API Endpoint

The integration uses Perplexity's OpenAI-compatible API at `https://api.perplexity.ai`.