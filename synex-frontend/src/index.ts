#!/usr/bin/env node

// Main entry point for the Synex CLI
// This is where everything starts when someone runs 'synex' in their terminal

import { readFileSync } from 'fs';
import { join } from 'path';
import { Command } from 'commander';
import chalk from 'chalk';
import { showWelcomeScreen } from './output/welcome.js';
import loginCommand from './commands/login.js';
import promptCommand from './commands/prompt.js';
import analyzeCommand from './commands/analyze.js';
import historyCommand from './commands/history.js';
import configCommand from './commands/config.js';

async function main() {
  // grab version from package json so we can show it in version flag
  // using readFileSync here since its just a one time read at startup
  const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

  // Set up the CLI using Commander.js - makes handling commands super clean
  const program = new Command();

  program
    .name('synex')
    .description('Synex - AI-powered CLI for developers')
    .version(packageJson.version);

  // Login command - for when users want to switch accounts or re-authenticate
  program
    .command('login')
    .description('Login to Synex')
    .action(async () => {
      await loginCommand();
    });

  // The main prompt command - this is where the magic happens
  // Users can send messages to AI and get responses
  program
    .command('prompt <message>')
    .description('Send a prompt to AI')
    .option('-m, --model <model>', 'AI model to use', 'openai/gpt-oss-20b:free')
    .action(async (message, options) => {
      await promptCommand(message, options);
    });

  // Analyze command - scans the codebase and gives insights
  program
    .command('analyze')
    .description('Analyze codebase')
    .action(async () => {
      await analyzeCommand();
    });

  // History command - shows previous interactions
  program
     .command('history')
     .description('Show command history')
     .action(async () => {
       await historyCommand();
     });

   // Config command for managing API keys and settings
   program
     .command('config <action>')
     .description('Manage configuration (show|validate|clear|set-model|update-key)')
     .option('-m, --model <model>', 'Set default model')
     .option('-k, --key <key>', 'API key (for future use)')
     .action(async (action, options) => {
       await configCommand(action, options);
     });

  // Check if no arguments provided (just 'synex' with no commands)
  if (process.argv.length <= 2) {
    await showWelcomeScreen();
    process.exit(0);
  }

  // Parse the command line arguments and execute the appropriate command
  program.parse();
}

// If anything goes wrong, we'll catch it and show a nice error
main().catch((error) => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});
