import axios, { AxiosInstance } from 'axios';
import { getApiKey, getDefaultModel } from '../utils/config.js';

// OpenRouter class handles API calls to OpenRouter models
export class OpenRouter {
  private client: AxiosInstance;
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || getApiKey() || '';
    this.model = model || getDefaultModel();

    this.client = axios.create({
      baseURL: 'https://openrouter.ai/api/v1',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/AnkanMisra/Synex',
        'X-Title': 'Synex CLI'
      },
      timeout: 30000
    });
  }

  // Sends prompt to OpenRouter and gets response
  async query(prompt: string, options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    stream?: boolean;
  }): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required. Please set it using the login command.');
    }

    try {
      const response = await this.client.post('/chat/completions', {
        model: options?.model || this.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options?.maxTokens || 1000,
        temperature: options?.temperature || 0.7,
        stream: options?.stream || false
      });

      if (response.data?.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      } else {
        throw new Error('Invalid response format from OpenRouter API');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid API key. Please check your OpenRouter API key.');
        } else if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (error.response?.status === 402) {
          throw new Error('Insufficient credits. Please add credits to your OpenRouter account.');
        } else {
          throw new Error(`OpenRouter API error: ${error.response?.data?.error?.message || error.message}`);
        }
      } else {
        throw new Error(`Failed to query OpenRouter: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  // Get available models from OpenRouter
  async getModels(): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required.');
    }

    try {
      const response = await this.client.get('/models');
      return response.data?.data || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch models: ${error.response?.data?.error?.message || error.message}`);
      } else {
        throw new Error(`Failed to fetch models: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      await this.query('Hello', { maxTokens: 10 });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Update API key
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.client.defaults.headers['Authorization'] = `Bearer ${apiKey}`;
  }

  // Update model
  setModel(model: string): void {
    this.model = model;
  }
}

export default OpenRouter;
