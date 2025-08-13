import { createInterface } from 'readline';
import chalk from 'chalk';
import { hasApiKey, setApiKey, removeApiKey, getApiKey } from '../utils/config.js';
import { validateApiKey, testBackendConnection } from '../utils/backend.js';

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
      return false;
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
      return false;
    }
  }
  
  // Original CLI flow for interactive input
  console.log(chalk.blue('\n🔑 OpenRouter API Key Login'));
  console.log('Please enter your OpenRouter API key.');
  console.log(chalk.dim('Get your API key at: https://openrouter.ai/keys\n'));
  console.log(chalk.green('✅ Backend connection successful'));
  
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('Enter your OpenRouter API key: ', async (apiKey) => {
      rl.close();
      
      if (!apiKey || apiKey.trim().length === 0) {
        console.log(chalk.red('❌ API key cannot be empty'));
        resolve(false);
        return;
      }
      
      try {
        console.log('\nValidating API key...');
        const validation = await validateApiKey(apiKey.trim());
        
        if (validation.valid) {
          setApiKey(apiKey.trim());
          console.log(chalk.green('✅ API key validated and saved successfully!'));
          console.log(chalk.dim(`Stored in: ~/.synex/config.json`));
          resolve(true);
        } else {
          console.log(chalk.red('❌ Invalid API key: ' + validation.message));
          console.log(chalk.yellow('Please check your API key and try again.'));
          resolve(false);
        }
      } catch (error: any) {
        console.log(chalk.red('❌ Error validating API key: ' + error.message));
        resolve(false);
      }
    });
  });
}

export default Auth;
