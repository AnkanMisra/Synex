#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import App from './tui/App.js';

// Clear the screen and start the TUI
process.stdout.write('\x1Bc');

// Render the main TUI app
render(<App />);
