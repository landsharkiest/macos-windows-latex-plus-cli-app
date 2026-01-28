const OpenAI = require('openai');
const config = require('../config/default.json');

class AIGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY;
    this.model = config.ai.model;
    this.enabled = config.ai.enabled;
    
    if (this.apiKey) {
      this.client = new OpenAI({
        apiKey: this.apiKey
      });
    }
  }

  /**
   * Check if AI integration is available
   * @returns {boolean}
   */
  isAvailable() {
    return !!this.apiKey && !!this.client;
  }

  /**
   * Generate LaTeX code from a text prompt
   * @param {string} prompt - Description of what to generate
   * @returns {Promise<string>} - Generated LaTeX code
   */
  async generate(prompt) {
    if (!this.isAvailable()) {
      throw new Error('AI integration not available. Set OPENAI_API_KEY environment variable.');
    }

    try {
      console.log('Generating LaTeX from prompt...');
      
      const systemPrompt = `You are a LaTeX expert. Generate clean, well-formatted LaTeX code based on user requests. 
Always include necessary packages and create complete, compilable documents. 
Use best practices and common LaTeX conventions.`;

      const userPrompt = `Generate LaTeX code for: ${prompt}

Please provide complete LaTeX code that can be compiled directly. Include all necessary packages and structure.`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const latexCode = response.choices[0].message.content;
      
      // Extract LaTeX code from markdown code blocks if present
      const codeBlockMatch = latexCode.match(/```(?:latex)?\n([\s\S]*?)\n```/);
      if (codeBlockMatch) {
        return codeBlockMatch[1].trim();
      }
      
      return latexCode.trim();
    } catch (error) {
      if (error.code === 'invalid_api_key') {
        throw new Error('Invalid OpenAI API key. Please check your OPENAI_API_KEY.');
      } else if (error.code === 'insufficient_quota') {
        throw new Error('OpenAI API quota exceeded. Please check your account.');
      } else {
        throw new Error(`AI generation failed: ${error.message}`);
      }
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
