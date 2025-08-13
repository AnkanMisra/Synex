import chalk from 'chalk';
import { loginWithAPIKey } from '../convex/auth.js';
import { hasApiKey, getConfigLocation } from '../utils/config.js';

// login command handler
export default async function loginCommand() {
  console.log(chalk.blue('🔐 Synex Login'));
  
  // Check if already logged in
  if (hasApiKey()) {
    console.log(chalk.yellow('You are already logged in.'));
    console.log(chalk.dim(`Config location: ${getConfigLocation()}`));
    console.log();
    
    // Ask if they want to update their API key
    const { createInterface } = await import('readline');
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise<void>((resolve) => {
      rl.question('Do you want to update your API key? (y/N): ', async (answer) => {
        rl.close();
        
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          const success = await loginWithAPIKey();
          if (success) {
            console.log(chalk.green('✅ API key updated successfully!'));
          }
        } else {
          console.log('Login cancelled.');
        }
        resolve();
      });
    });
  } else {
    // First time login
    const success = await loginWithAPIKey();
    if (success) {
      console.log(chalk.green('\n🎉 Welcome to Synex! You can now use all commands.'));
      console.log(chalk.dim('Try: synex prompt "Hello, how are you?"'));
    }
  }
}