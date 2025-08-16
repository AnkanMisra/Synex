import { createInterface } from 'readline';
import chalk from 'chalk';
import { hasApiKey, setApiKey, removeApiKey, getApiKey } from '../utils/config.js';
import { validateApiKey, testBackendConnection } from '../utils/backend.js';

// Secure input function that masks the API key
function secureInput(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    
    let input = '';
    const stdin = process.stdin;
    
    // Set raw mode to capture individual keystrokes
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    const onData = (key: string) => {
      // Handle different key inputs
      if (key === '\r' || key === '\n') {
        // Enter key - finish input
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(input);
      } else if (key === '\u0003') {
        // Ctrl+C - exit
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        process.exit(0);
      } else if (key === '\u007f' || key === '\b') {
        // Backspace - remove last character
        if (input.length > 0) {
          input = input.slice(0, -1);
          process.stdout.write('\b \b');
        }
      } else if (key >= ' ' && key <= '~') {
        // Printable characters - add to input and show asterisk
        input += key;
        process.stdout.write('*');
      }
    };
    
    stdin.on('data', onData);
  });
}

// auth class handles user authentication and sessions
export class Auth {
  constructor() {
    // basic auth setup
  }

  // main login method
  async login(): Promise<boolean> {
    return await loginWithAPIKey();
  }

  // logout and clear session
  async logout(): Promise<void> {
    removeApiKey();
    console.log(chalk.green('Logged out successfully. API key removed.'));
  }
}

// checks if user is currently logged in
export function isAuthenticated(): boolean {
  return hasApiKey();
}

// free api login flow - deprecated, now redirects to API key login
export async function loginWithFreeAPI(): Promise<boolean> {
  console.log(chalk.yellow('\nFree API access is no longer available.'));
  console.log('Please use your own OpenRouter API key instead.');
  console.log('You can get one at: https://openrouter.ai/keys\n');
  return await loginWithAPIKey();
}

// api key login for openrouter
export async function loginWithAPIKey(providedApiKey?: string): Promise<boolean> {
  // Check backend connection first
  const backendConnected = await testBackendConnection();
  if (!backendConnected) {
    console.log(chalk.red('❌ Cannot connect to backend server.'));
    console.log(chalk.yellow('Please make sure the backend is running on http://localhost:3000'));
    console.log(chalk.dim('Run: cd synex-backend && pnpm run dev'));
    return false;
  }

  // If API key is provided (from TUI), use it directly
  if (providedApiKey) {
    if (!providedApiKey.trim()) {
      throw new Error('API key cannot be empty');
    }

    try {
      const validation = await validateApiKey(providedApiKey.trim());

      if (validation.valid) {
        setApiKey(providedApiKey.trim());
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      console.error(chalk.red('❌ API key validation failed:'), error.message || error);
      if (error.stack) {
        console.error(chalk.dim('Stack trace:'), error.stack);
      }
      return false;
    }
  }

  // Original CLI flow for interactive input
  console.log(chalk.blue('\n🔑 OpenRouter API Key Login'));
  console.log('Please enter your OpenRouter API key.');
  console.log(chalk.dim('Get your API key at: https://openrouter.ai/keys\n'));
  console.log(chalk.green('✅ Backend connection successful'));

  try {
    const apiKey = await secureInput('Enter your OpenRouter API key: ');

    if (!apiKey || apiKey.trim().length === 0) {
      console.log(chalk.red('❌ API key cannot be empty'));
      return false;
    }

    try {
      console.log('Validating API key...');
      const validation = await validateApiKey(apiKey.trim());

      if (validation.valid) {
        setApiKey(apiKey.trim());
        console.log(chalk.green('✅ API key validated and saved successfully!'));
        console.log(chalk.dim(`Stored in: ~/.synex/config.json`));
        return true;
      } else {
        console.log(chalk.red('❌ Invalid API key: ' + validation.message));
        console.log(chalk.yellow('Please check your API key and try again.'));
        return false;
      }
    } catch (error: any) {
      console.log(chalk.red('❌ Error validating API key: ' + error.message));
      return false;
    }
  } catch (error: any) {
    console.log(chalk.red('❌ Input error: ' + error.message));
    return false;
  }
}

export default Auth;
