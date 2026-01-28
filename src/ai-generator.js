const OpenAI = require('openai');
const axios = require('axios');
const config = require('../config/default.json');

class AIGenerator {
  constructor(options = {}) {
    this.provider = options.provider || process.env.AI_PROVIDER || config.ai.provider || 'openai';
    this.enabled = config.ai.enabled;
    
    // OpenAI configuration
    this.openaiApiKey = options.apiKey || process.env.OPENAI_API_KEY;
    this.openaiModel = options.model || config.ai.openai?.model || 'gpt-4';
    
    // Ollama configuration
    this.ollamaBaseUrl = options.ollamaBaseUrl || process.env.OLLAMA_BASE_URL || config.ai.ollama?.baseUrl || 'http://localhost:11434';
    this.ollamaModel = options.ollamaModel || process.env.OLLAMA_MODEL || config.ai.ollama?.model || 'llama2';
    
    // Initialize clients based on provider
    if (this.provider === 'openai' && this.openaiApiKey) {
      try {
        this.openaiClient = new OpenAI({
          apiKey: this.openaiApiKey
        });
      } catch (error) {
        console.error('Failed to initialize OpenAI client:', error.message);
      }
    }
  }

  /**
   * Check if AI integration is available
   * @returns {boolean}
   */
  isAvailable() {
    if (!this.enabled) {
      return false;
    }
    
    if (this.provider === 'openai') {
      return !!this.openaiApiKey && !!this.openaiClient;
    } else if (this.provider === 'ollama') {
      // Ollama is available if configured (we'll verify connectivity when generating)
      return true;
    }
    
    return false;
  }

  /**
   * Get the current provider name
   * @returns {string}
   */
  getProvider() {
    return this.provider;
  }

  /**
   * Test Ollama connection
   * @returns {Promise<boolean>}
   */
  async testOllamaConnection() {
    try {
      const response = await axios.get(`${this.ollamaBaseUrl}/api/tags`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate LaTeX code using OpenAI
   * @param {string} prompt - Description of what to generate
   * @returns {Promise<string>} - Generated LaTeX code
   */
  async generateWithOpenAI(prompt) {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized. Set OPENAI_API_KEY environment variable.');
    }

    try {
      console.log('Generating LaTeX with OpenAI...');
      
      const systemPrompt = `You are a LaTeX expert. Generate clean, well-formatted LaTeX code based on user requests. 
Always include necessary packages and create complete, compilable documents. 
Use best practices and common LaTeX conventions.`;

      const userPrompt = `Generate LaTeX code for: ${prompt}

Please provide complete LaTeX code that can be compiled directly. Include all necessary packages and structure.`;

      const response = await this.openaiClient.chat.completions.create({
        model: this.openaiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const latexCode = response.choices[0].message.content;
      
      // Extract LaTeX code from markdown code blocks if present
      return this.extractLatexCode(latexCode);
    } catch (error) {
      if (error.code === 'invalid_api_key') {
        throw new Error('Invalid OpenAI API key. Please check your OPENAI_API_KEY.');
      } else if (error.code === 'insufficient_quota') {
        throw new Error('OpenAI API quota exceeded. Please check your account.');
      } else {
        throw new Error(`OpenAI generation failed: ${error.message}`);
      }
    }
  }

  /**
   * Generate LaTeX code using Ollama (local)
   * @param {string} prompt - Description of what to generate
   * @returns {Promise<string>} - Generated LaTeX code
   */
  async generateWithOllama(prompt) {
    try {
      console.log(`Generating LaTeX with Ollama (${this.ollamaModel})...`);
      
      // First check if Ollama is running
      const isConnected = await this.testOllamaConnection();
      if (!isConnected) {
        throw new Error(`Cannot connect to Ollama at ${this.ollamaBaseUrl}. Make sure Ollama is running.`);
      }

      const systemPrompt = `You are a LaTeX expert. Generate clean, well-formatted LaTeX code based on user requests. 
Always include necessary packages and create complete, compilable documents. 
Use best practices and common LaTeX conventions.`;

      const userPrompt = `Generate LaTeX code for: ${prompt}

Please provide complete LaTeX code that can be compiled directly. Include all necessary packages and structure.`;

      const response = await axios.post(
        `${this.ollamaBaseUrl}/api/generate`,
        {
          model: this.ollamaModel,
          prompt: `${systemPrompt}\n\n${userPrompt}`,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 2000
          }
        },
        {
          timeout: 120000 // 2 minutes timeout for local generation
        }
      );

      if (!response.data || !response.data.response) {
        throw new Error('Invalid response from Ollama');
      }

      const latexCode = response.data.response;
      
      // Extract LaTeX code from markdown code blocks if present
      return this.extractLatexCode(latexCode);
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Cannot connect to Ollama at ${this.ollamaBaseUrl}. Make sure Ollama is installed and running.\nInstall: https://ollama.ai`);
      } else if (error.response?.status === 404) {
        throw new Error(`Model '${this.ollamaModel}' not found. Pull it with: ollama pull ${this.ollamaModel}`);
      } else {
        throw new Error(`Ollama generation failed: ${error.message}`);
      }
    }
  }

  /**
   * Extract LaTeX code from markdown code blocks
   * @param {string} text - Text potentially containing LaTeX code
   * @returns {string} - Extracted LaTeX code
   */
  extractLatexCode(text) {
    // Try to extract from code blocks
    const codeBlockMatch = text.match(/```(?:latex|tex)?\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }
    
    // If no code block, return as is
    return text.trim();
  }

  /**
   * Generate LaTeX code from a text prompt
   * @param {string} prompt - Description of what to generate
   * @returns {Promise<string>} - Generated LaTeX code
   */
  async generate(prompt) {
    if (!this.isAvailable()) {
      throw new Error('AI integration not available. Configure AI provider in config or set environment variables.');
    }

    if (this.provider === 'openai') {
      return await this.generateWithOpenAI(prompt);
    } else if (this.provider === 'ollama') {
      return await this.generateWithOllama(prompt);
    } else {
      throw new Error(`Unknown AI provider: ${this.provider}`);
    }
  }

  /**
   * Generate LaTeX code and save to file
   * @param {string} prompt - Description of what to generate
   * @param {string} outputPath - Where to save the generated .tex file
   * @returns {Promise<string>} - Path to the generated file
   */
  async generateToFile(prompt, outputPath) {
    const latexCode = await this.generate(prompt);
    const fs = require('fs');
    const path = require('path');
    
    // Ensure output path has .tex extension
    if (!outputPath.endsWith('.tex')) {
      outputPath += '.tex';
    }
    
    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, latexCode);
    return outputPath;
  }
}

module.exports = AIGenerator;
