# AI Integration Guide

This guide explains how to set up and use AI features in LaTeX Plus with either OpenAI (cloud) or Ollama (local).

## Overview

LaTeX Plus supports two AI providers:

1. **OpenAI** - Cloud-based, high-quality but requires API key and internet
2. **Ollama** - Local, private, offline-capable, free but requires installation

## Option 1: OpenAI (Cloud)

### Pros
- High-quality LaTeX generation
- No local setup required
- Fast response times
- Works on any machine

### Cons
- Requires API key (paid service)
- Requires internet connection
- Data sent to OpenAI servers

### Setup

1. Get an API key from [platform.openai.com](https://platform.openai.com/api-keys)

2. Set environment variables:
   ```bash
   export AI_PROVIDER=openai
   export OPENAI_API_KEY="sk-your-key-here"
   ```

3. Test it:
   ```bash
   node cli/latex-cli.js generate "Create a simple article"
   ```

## Option 2: Ollama (Local)

### Pros
- Completely free
- Works offline
- Private (data stays on your machine)
- No API keys needed
- Multiple model options

### Cons
- Requires installation
- Uses local compute resources
- May be slower than cloud AI
- Quality depends on model choice

### Setup

1. **Install Ollama**

   - **macOS**: `brew install ollama`
   - **Linux**: `curl -fsSL https://ollama.ai/install.sh | sh`
   - **Windows**: Download from [ollama.ai](https://ollama.ai)

2. **Pull a model** (codellama recommended for LaTeX):
   ```bash
   ollama pull codellama
   ```

   Other good options:
   - `llama2` - General purpose (7B)
   - `mistral` - Fast and capable (7B)
   - `mixtral` - High quality (47B, requires more RAM)
   - `neural-chat` - Conversational (7B)

3. **Start Ollama service**:
   ```bash
   ollama serve
   ```
   
   Leave this running in the background.

4. **Set environment variables**:
   ```bash
   export AI_PROVIDER=ollama
   export OLLAMA_MODEL=codellama
   ```

5. **Test it**:
   ```bash
   node cli/latex-cli.js generate "Create a simple article"
   ```

## Using AI in the GUI

1. Start the application: `npm start`
2. The AI status indicator will show which provider is active
3. Click "AI Generate" button
4. The modal will display the current provider
5. Enter your prompt and click Generate

## Using AI in the CLI

### Basic usage
```bash
# Use default provider from config
node cli/latex-cli.js generate "Create a research paper"

# Specify provider explicitly
node cli/latex-cli.js generate "Create a resume" -p ollama

# Specify model
node cli/latex-cli.js generate "Create a presentation" -p ollama -m codellama

# Generate and compile
node cli/latex-cli.js generate "Create a math worksheet" --compile
```

### Advanced usage

```bash
# Use custom Ollama host
export OLLAMA_BASE_URL=http://192.168.1.100:11434
node cli/latex-cli.js generate "Create document"

# Try different OpenAI models
node cli/latex-cli.js generate "Complex document" -p openai -m gpt-3.5-turbo
```

## Comparing Providers

| Feature | OpenAI | Ollama |
|---------|--------|--------|
| Cost | Paid (per token) | Free |
| Internet | Required | Not required |
| Setup | Easy | Moderate |
| Quality | Excellent | Good to Very Good |
| Speed | Fast | Varies by model |
| Privacy | Cloud | Local |
| Models | GPT-3.5, GPT-4 | Many open models |

## Recommended Models

### For Ollama

**Best for LaTeX** (in order):
1. `codellama:13b` - Best quality, needs 16GB+ RAM
2. `codellama` - Good balance (7B)
3. `mistral` - Fast, decent quality
4. `llama2` - General purpose fallback

**Installing larger models**:
```bash
# 13B version (better quality, more RAM needed)
ollama pull codellama:13b

# 34B version (excellent quality, needs 32GB+ RAM)
ollama pull codellama:34b
```

## Troubleshooting

### OpenAI Issues

**Invalid API Key**
- Verify your key at platform.openai.com
- Check for spaces or quotes in the environment variable

**Quota Exceeded**
- Check your billing at platform.openai.com/account/billing
- Consider switching to Ollama

### Ollama Issues

**Cannot connect to Ollama**
```bash
# Check if Ollama is running
ps aux | grep ollama

# Start Ollama manually
ollama serve
```

**Model not found**
```bash
# List installed models
ollama list

# Pull the missing model
ollama pull codellama
```

**Out of memory**
- Try a smaller model (7B instead of 13B)
- Close other applications
- Use `llama2` which is more memory efficient

**Slow generation**
- Try a smaller/faster model (`mistral`, `llama2`)
- Ensure Ollama is using GPU if available
- Check CPU usage with `top` or Task Manager

## Environment Variables Reference

```bash
# Provider selection
AI_PROVIDER=openai          # or 'ollama'

# OpenAI settings
OPENAI_API_KEY=sk-xxx       # Your OpenAI API key

# Ollama settings
OLLAMA_BASE_URL=http://localhost:11434  # Ollama server URL
OLLAMA_MODEL=codellama      # Model to use

# Example: Use Ollama with custom settings
export AI_PROVIDER=ollama
export OLLAMA_BASE_URL=http://localhost:11434
export OLLAMA_MODEL=codellama:13b
```

## Tips for Best Results

### Prompt Writing

Good prompts lead to better LaTeX:

**Good**:
- "Create a research paper with title, abstract, introduction, methods, results, and conclusion sections"
- "Create a two-column IEEE format paper about machine learning"
- "Generate a math exam with 10 calculus problems"

**Less Good**:
- "Make a paper" (too vague)
- "Document" (unclear what type)

### Model Selection

- **For academic papers**: Use `codellama` or OpenAI GPT-4
- **For quick drafts**: Use `mistral` or GPT-3.5
- **For complex documents**: Use larger models (13B+) or GPT-4

### Performance Tips

- First generation with Ollama is slower (model loading)
- Keep `ollama serve` running for faster subsequent generations
- Use smaller models for simple documents
- Cache frequently used templates instead of regenerating
