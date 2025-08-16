import chalk from 'chalk';
import { hasApiKey, getApiKey, getConfigLocation, clearConfig, getDefaultModel, setDefaultModel } from '../utils/config.js';
import { validateApiKey } from '../utils/backend.js';
import { loginWithAPIKey } from '../convex/auth.js';

// Config command handler for managing API keys and settings
export default async function configCommand(action: string, options: { model?: string; key?: string }) {
  switch (action) {
    case 'show':
      await showConfig();
      break;
    case 'validate':
      await validateConfig();
      break;
    case 'clear':
      await clearConfigCommand();
      break;
    case 'set-model':
      await setModelCommand(options.model);
      break;
    case 'update-key':
      await updateKeyCommand();
      break;
    default:
      showConfigHelp();
      break;
  }
}

async function showConfig() {
  console.log(chalk.blue('📋 Synex Configuration'));
  console.log();

  if (hasApiKey()) {
    console.log(chalk.green('✅ API Key: Configured'));
    console.log(chalk.dim(`   Config location: ${getConfigLocation()}`));
    console.log(chalk.dim(`   Default model: ${getDefaultModel()}`));
  } else {
    console.log(chalk.red('❌ API Key: Not configured'));
    console.log(chalk.yellow('   Run "synex login" to set up your API key'));
  }

  console.log(chalk.blue(`🤖 Default Model: ${getDefaultModel()}`));
  console.log();
}

async function validateConfig() {
  console.log(chalk.blue('🔍 Validating Configuration'));
  console.log();

  if (!hasApiKey()) {
    console.log(chalk.red('❌ No API key configured'));
    console.log(chalk.yellow('   Run "synex login" to set up your API key'));
    return;
  }

  try {
    const storedApiKey = getApiKey();
    const isValid = await validateApiKey(storedApiKey!);
    if (isValid) {
      console.log(chalk.green('✅ API key is valid'));
      console.log(chalk.dim(`   Model: ${getDefaultModel()}`));
    } else {
      console.log(chalk.red('❌ API key is invalid'));
      console.log(chalk.yellow('   Run "synex config update-key" to update your API key'));
    }
  } catch (error: any) {
    console.log(chalk.red('❌ Validation failed: ' + error.message));
  }
  console.log();
}

async function clearConfigCommand() {
  if (!hasApiKey()) {
    console.log(chalk.yellow('No configuration to clear.'));
    return;
  }

  const { createInterface } = await import('readline');
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise<void>((resolve) => {
    rl.question(chalk.yellow('Are you sure you want to clear all configuration? (y/N): '), (answer) => {
      rl.close();

      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        clearConfig();
        console.log(chalk.green('✅ Configuration cleared successfully'));
      } else {
        console.log('Operation cancelled.');
      }
      resolve();
    });
  });
}

async function setModelCommand(model?: string) {
  if (!model) {
    console.log(chalk.red('❌ Please specify a model'));
    console.log(chalk.dim('   Example: synex config set-model --model "openai/gpt-4o-mini"'));
    return;
  }

  setDefaultModel(model);
  console.log(chalk.green(`✅ Default model set to: ${model}`));
}

async function updateKeyCommand() {
  console.log(chalk.blue('🔑 Updating API Key'));
  console.log();

  const success = await loginWithAPIKey();
  if (success) {
    console.log(chalk.green('✅ API key updated successfully!'));
  }
}

function showConfigHelp() {
  console.log(chalk.blue('📋 Synex Config Commands'));
  console.log();
  console.log('Available actions:');
  console.log(chalk.green('  show') + '        Show current configuration');
  console.log(chalk.green('  validate') + '     Validate API key');
  console.log(chalk.green('  clear') + '       Clear all configuration');
  console.log(chalk.green('  set-model') + '    Set default model (--model <model>)');
  console.log(chalk.green('  update-key') + '   Update API key');
  console.log();
  console.log('Examples:');
  console.log(chalk.dim('  synex config show'));
  console.log(chalk.dim('  synex config validate'));
  console.log(chalk.dim('  synex config set-model --model "openai/gpt-4o-mini"'));
  console.log(chalk.dim('  synex config update-key'));
  console.log();
}
