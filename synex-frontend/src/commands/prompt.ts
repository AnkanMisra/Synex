import chalk from 'chalk';
import ora from 'ora';
import { sendChatRequest } from '../utils/backend.js';
import { getDefaultModel, hasApiKey } from '../utils/config.js';
import { loginWithAPIKey } from '../convex/auth.js';

// main prompt command where users send messages to ai
export default async function promptCommand(message: string, options: { model?: string }) {
  // Check if user is authenticated
  if (!hasApiKey()) {
    console.log(chalk.yellow('🔐 You need to login first to use the prompt command.'));
    console.log('Please provide your OpenRouter API key:\n');
    
    const loginSuccess = await loginWithAPIKey();
    if (!loginSuccess) {
      console.log(chalk.red('❌ Login failed. Cannot proceed with prompt.'));
      return;
    }
    console.log(); // Add spacing
  }
  
  const model = options.model || getDefaultModel();
  
  console.log(chalk.blue('💬 Sending prompt to AI...'));
  console.log(chalk.dim(`Model: ${model}`));
  console.log(chalk.dim(`Message: ${message}`));
  console.log();
  
  const spinner = ora('Processing your request...').start();
  
  try {
    const response = await sendChatRequest({
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      model
    });
    
    spinner.stop();
    
    // Display the AI response
    console.log(chalk.green('🤖 AI Response:'));
    console.log(chalk.white(response.message.content));
    console.log();
    
    // Display usage information
    if (response.usage) {
      console.log(chalk.dim(`📊 Usage: ${response.usage.prompt_tokens} prompt + ${response.usage.completion_tokens} completion = ${response.usage.total_tokens} total tokens`));
    }
    
  } catch (error: any) {
    spinner.stop();
    const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
    console.log(chalk.red('❌ Error: ' + errorMessage));
    
    // If it's an auth error, suggest re-login
    if (error.message.includes('Invalid API key') || error.message.includes('login')) {
      console.log(chalk.yellow('💡 Try running "synex login" to update your API key.'));
    }
    
    // If it's a connection error, suggest checking backend
    if (error.message.includes('Cannot connect to backend')) {
      console.log(chalk.yellow('💡 Make sure the backend server is running:'));
      console.log(chalk.dim('   cd synex-backend && pnpm run dev'));
    }
  }
}