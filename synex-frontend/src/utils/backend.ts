import axios, { AxiosResponse } from 'axios';
import { getApiKey, getBackendUrl } from './config.js';

// Backend response interfaces
interface BackendResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

interface ChatResponse {
  message: {
    role: string;
    content: string;
  };
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}

interface ValidationResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// Create axios instance with default config
function createBackendClient() {
  const baseURL = getBackendUrl();
  
  return axios.create({
    baseURL,
    timeout: 30000, // 30 second timeout
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// Add authorization header if API key is available
function addAuthHeader(apiKey?: string) {
  const key = apiKey || getApiKey();
  if (!key) {
    throw new Error('No API key found. Please run "synex login" first.');
  }
  return {
    'Authorization': `Bearer ${key}`
  };
}

// Test backend connectivity
export async function testBackendConnection(): Promise<boolean> {
  try {
    const client = createBackendClient();
    const response = await client.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

// Validate API key with backend
export async function validateApiKey(apiKey?: string): Promise<{ valid: boolean; message: string }> {
  try {
    const client = createBackendClient();
    const headers = addAuthHeader(apiKey);
    
    const response: AxiosResponse<ValidationResponse> = await client.post(
      '/api/v1/llm/validate',
      {},
      { headers }
    );
    
    return {
      valid: response.data.success,
      message: response.data.message
    };
  } catch (error: any) {
    if (error.response?.status === 401) {
      return {
        valid: false,
        message: 'Invalid API key'
      };
    }
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to backend. Make sure the backend server is running on ' + getBackendUrl());
    }
    
    throw new Error(`API key validation failed: ${error.message}`);
  }
}

// Send chat completion request
export async function sendChatRequest(request: ChatRequest): Promise<ChatResponse> {
  try {
    const client = createBackendClient();
    const headers = addAuthHeader();
    
    const response: AxiosResponse<BackendResponse<ChatResponse>> = await client.post(
      '/api/v1/llm/chat',
      request,
      { headers }
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Chat request failed');
    }
    
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please run "synex login" to update your credentials.');
    }
    
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to backend. Make sure the backend server is running on ' + getBackendUrl());
    }
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    throw new Error(`Chat request failed: ${error.message}`);
  }
}

// Get backend health status
export async function getBackendHealth(): Promise<any> {
  try {
    const client = createBackendClient();
    const response = await client.get('/health');
    return response.data;
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to backend. Make sure the backend server is running on ' + getBackendUrl());
    }
    throw new Error(`Health check failed: ${error.message}`);
  }
}