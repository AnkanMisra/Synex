#!/usr/bin/env node

// Main entry point for the Synex CLI
// This is where everything starts when someone runs 'synex' in their terminal

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';

// Import all our command handlers - keeping things modular
import loginCommand from './commands/login.js';
import promptCommand from './commands/prompt.js';
import analyzeCommand from './commands/analyze.js';
import historyCommand from './commands/history.js';

// UI and authentication utilities
import { showWelcomeScreen } from './output/welcome.js';
import { isAuthenticated, loginWithFreeAPI, loginWithAPIKey } from './convex/auth.js';

async function main() {
  // grab version from package json so we can show it in version flag
  // using readFileSync here since its just a one time read at startup
  const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

  // first things first check if user is already logged in
  // if not we need to show them the welcome screen and get them authenticated
  if (!isAuthenticated()) {
    // show our fancy welcome screen and let user choose login method
    const loginMethod = await showWelcomeScreen();

    // try to log them in based on their choice
    let loginSuccess = false;
    if (loginMethod === 'free') {
      // free tier uses our shared api keys
      loginSuccess = await loginWithFreeAPI();
    } else if (loginMethod === 'apikey') {
      // premium user brings their own api key
      loginSuccess = await loginWithAPIKey();
    }

    // if login failed for any reason bail out gracefully
    if (!loginSuccess) {
      console.log(chalk.red('Login failed. Please try again.'));
      process.exit(1);
    }

    // success let them know theyre good to go
    console.log(chalk.green(`Login successful! Selected method: ${loginMethod}`));
    console.log('You can now use Synex commands.');
    console.log();
  }

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
    .action(() => {
      loginCommand();
    });

  // The main prompt command - this is where the magic happens
  // Users can send messages to AI and get responses
  program
    .command('prompt <message>')
    .description('Send a prompt to AI')
    .option('-m, --model <model>', 'AI model to use', 'gpt-oss-2b')
    .action((message, options) => {
      promptCommand(message, options);
    });

  // Analyze command - scans the codebase and gives insights
  program
    .command('analyze')
    .description('Analyze codebase')
    .action(() => {
      analyzeCommand();
    });

  // History command - shows previous interactions
  program
    .command('history')
    .description('Show command history')
    .action(() => {
      historyCommand();
    });

  // Parse the command line arguments and execute the appropriate command
  program.parse();
}

// If anything goes wrong, we'll catch it and show a nice error
main().catch((error) => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});
