#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import App from './tui/App.js';

// Clear the screen and start the TUI
try {
  // Only clear screen if we're in a TTY environment
  if (process.stdout.isTTY) {
    process.stdout.write('\x1Bc');
  }

  // Render the main TUI app
  render(<App />);
} catch (error) {
  console.error('Failed to start Synex TUI:', error instanceof Error ? error.message : error);
  if (error instanceof Error && error.stack) {
    console.error('Stack trace:', error.stack);
  }
  
  // Fallback message to stderr
  process.stderr.write('Synex TUI failed to initialize. Please check your terminal environment.\n');
  process.exit(1);
}
