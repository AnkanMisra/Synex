import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import * as fs from 'fs';

// Configuration interface
interface SynexConfig {
  openRouterApiKey?: string;
  backendUrl?: string;
  defaultModel?: string;
}

// Default configuration
const DEFAULT_CONFIG: SynexConfig = {
  backendUrl: 'http://localhost:3000',
  defaultModel: 'openai/gpt-oss-20b:free'
};

// Get the config directory path
function getConfigDir(): string {
  return join(homedir(), '.synex');
}

// Get the config file path
function getConfigPath(): string {
  return join(getConfigDir(), 'config.json');
}

// Ensure config directory exists
function ensureConfigDir(): void {
  const configDir = getConfigDir();
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
}

// Load configuration from file
export function loadConfig(): SynexConfig {
  const configPath = getConfigPath();
  
  if (!existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }
  
  try {
    const configData = readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    console.warn('Failed to load config, using defaults:', error);
    return { ...DEFAULT_CONFIG };
  }
}

// Save configuration to file
export function saveConfig(config: SynexConfig): void {
  ensureConfigDir();
  const configPath = getConfigPath();
  
  try {
    writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    throw new Error(`Failed to save config: ${error}`);
  }
}

// Get OpenRouter API key
export function getApiKey(): string | null {
  const config = loadConfig();
  return config.openRouterApiKey || null;
}

// Set OpenRouter API key
export function setApiKey(apiKey: string): void {
  const config = loadConfig();
  config.openRouterApiKey = apiKey;
  saveConfig(config);
}

// Remove OpenRouter API key
export function removeApiKey(): void {
  const config = loadConfig();
  delete config.openRouterApiKey;
  saveConfig(config);
}

// Get backend URL
export function getBackendUrl(): string {
  const config = loadConfig();
  return config.backendUrl || DEFAULT_CONFIG.backendUrl!;
}

// Set backend URL
export function setBackendUrl(url: string): void {
  const config = loadConfig();
  config.backendUrl = url;
  saveConfig(config);
}

// Get default model
export function getDefaultModel(): string {
  const config = loadConfig();
  return config.defaultModel || DEFAULT_CONFIG.defaultModel!;
}

// Set default model
export function setDefaultModel(model: string): void {
  const config = loadConfig();
  config.defaultModel = model;
  saveConfig(config);
}

export function clearConfig(): void {
  const configPath = getConfigLocation();
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
}

// Check if API key is configured
export function hasApiKey(): boolean {
  return getApiKey() !== null;
}

// Get config file location for display
export function getConfigLocation(): string {
  return getConfigPath();
}