// bring in color styling and text width calculation tools
import chalk from 'chalk';
import stringWidth from 'string-width';
import { SYNEX_LOGO } from './banner.js';

// centers any text in the terminal by calculating spaces needed
function centerText(text: string, width: number): string {
  const visibleWidth = stringWidth(text);
  const padding = Math.max(0, Math.floor((width - visibleWidth) / 2));
  return ' '.repeat(padding) + text;
}

// builds a fancy welcome box with unicode borders
function createWelcomeBox(width: number): string[] {
  const boxText = '✻ Welcome to Synex ✻';
  const boxWidth = Math.max(boxText.length + 4, 30);
  const leftPadding = Math.max(0, Math.floor((width - boxWidth) / 2));
  const padding = ' '.repeat(leftPadding);

  // calculate inner spacing for perfect text centering
  const innerWidth = boxWidth - 2;
  const textPadding = Math.max(0, Math.floor((innerWidth - boxText.length) / 2));
  const rightTextPadding = innerWidth - boxText.length - textPadding;

  return [
    padding + '╭' + '─'.repeat(boxWidth - 2) + '╮',
    padding + '│' + ' '.repeat(textPadding) + boxText + ' '.repeat(rightTextPadding) + '│',
    padding + '╰' + '─'.repeat(boxWidth - 2) + '╯'
  ];
}

// main function that shows the welcome screen and handles user input
export async function showWelcomeScreen(): Promise<string> {
  // clear the screen completely
  process.stdout.write('\x1Bc');

  // get terminal dimensions with fallback values
  const terminalWidth = process.stdout.columns || 80;
  const terminalHeight = process.stdout.rows || 24;

  // calculate all the heights to center everything vertically
  const logoHeight = SYNEX_LOGO.length;
  const welcomeBoxHeight = 3;
  const descriptionHeight = 1;
  const selectTextHeight = 1;
  const promptHeight = 5;
  const spacingHeight = 6;
  const totalContentHeight = welcomeBoxHeight + logoHeight + descriptionHeight + selectTextHeight + promptHeight + spacingHeight;

  // figure out how much space to add at the top
  const verticalPadding = Math.max(1, Math.floor((terminalHeight - totalContentHeight) / 2));

  for (let i = 0; i < verticalPadding; i++) {
    console.log();
  }

  const welcomeBox = createWelcomeBox(terminalWidth);
  welcomeBox.forEach(line => {
    console.log(chalk.cyan(line));
  });
  console.log();

  // create a nice blue gradient for the logo
  const colors = [
  chalk.hex('#00FFFF'), // bright cyan
  chalk.hex('#00CED1'), // dark turquoise
  chalk.hex('#1E90FF')  // dodger blue
];

  // paint each logo line with rotating colors
  SYNEX_LOGO.forEach((line, index) => {
    // use modulo math to cycle through our 3 colors
    const colorIndex = index % colors.length;
    console.log(colors[colorIndex](centerText(line, terminalWidth)));
  });
  console.log();

  const description = 'AI tool for code review, analysis and smart automation.';
  console.log(centerText(description, terminalWidth));
  console.log();

  // setup the login options with emojis and descriptions
  const menuOptions = [
    {
      title: '🚀 Free API Login',
      description: 'Quick start with free credits',
      value: 'free'
    },
    {
      title: '🔑 API Key Login',
      description: 'Use your own API key for unlimited access',
      value: 'apikey'
    }
  ];

  // track which option is selected and what user picked
  let selectedIndex = 0;
  let userChoice = null;

  // redraws the entire screen with current selection highlighted
  function displayCenteredMenu() {
    // wipe screen and move cursor to top
    process.stdout.write('\x1B[2J\x1B[H');

    // add the top spacing again
    for (let i = 0; i < verticalPadding; i++) {
      console.log();
    }

    const welcomeBox = createWelcomeBox(terminalWidth);
    welcomeBox.forEach(line => {
      console.log(chalk.cyan(line));
    });
    console.log();

    SYNEX_LOGO.forEach((line, index) => {
      const colorIndex = index % colors.length;
      console.log(colors[colorIndex](centerText(line, terminalWidth)));
    });
    console.log();

    // show the old description in the redraw function
    const description = 'Synex is your AI-powered CLI for code analysis, prompts, and automation.';
    console.log(centerText(description, terminalWidth));
    console.log();

    // show the menu title in cyan
    const selectText = chalk.cyan('Select login method:');
    console.log(centerText(selectText, terminalWidth));
    console.log();

    // draw each menu option with selection arrow and description
     menuOptions.forEach((option, index) => {
       const isSelected = index === selectedIndex;
       const prefix = isSelected ? chalk.cyan('❯ ') : '  ';
       const title = isSelected ? chalk.cyan.bold(option.title) : chalk.cyan(option.title);
       const description = chalk.dim(`(${option.description})`);
       const optionLine = prefix + title + ' ' + description;
       console.log(centerText(optionLine, terminalWidth));
     });

    console.log();
    const hint = chalk.dim('Use arrow keys to navigate, Enter to select, Ctrl+C to exit');
    console.log(centerText(hint, terminalWidth));
  }

  // display initial menu
  displayCenteredMenu();

  // wait for user to pick something with keyboard input
   const response = await new Promise<{ loginMethod: string }>((resolve) => {
     if (process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
       // fancy arrow key navigation mode
       process.stdin.setRawMode(true);
       process.stdin.resume();
       process.stdin.setEncoding('utf8');

       // handle all the different key presses
       const keyHandler = (key: string) => {
         if (key === '\u0003') { // ctrl+c means quit
           process.stdout.write('\x1Bc');
           process.exit(0);
         } else if (key === '\u001b[A' || key === '\u001b[D') { // up or left arrow
           selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : menuOptions.length - 1;
           displayCenteredMenu();
         } else if (key === '\u001b[B' || key === '\u001b[C') { // down or right arrow
           selectedIndex = selectedIndex < menuOptions.length - 1 ? selectedIndex + 1 : 0;
           displayCenteredMenu();
         } else if (key === '\r' || key === '\n') { // enter key confirms choice
           userChoice = menuOptions[selectedIndex].value;
           process.stdin.setRawMode(false);
           process.stdin.removeListener('data', keyHandler);
           process.stdin.pause();
           resolve({ loginMethod: userChoice });
         }
       };

       process.stdin.on('data', keyHandler);
     } else {
       // simple number input when arrow keys dont work
       console.log();
       console.log(centerText(chalk.yellow('Interactive mode not available. Using fallback.'), terminalWidth));
       console.log();
       console.log(centerText('Enter 1 for Free API Login, 2 for API Key Login:', terminalWidth));

       process.stdin.resume();
       process.stdin.setEncoding('utf8');

       // handle typed numbers for login choice
       const inputHandler = (input: string) => {
         const choice = input.trim();
         if (choice === '1') {
           userChoice = 'free';
           process.stdin.removeListener('data', inputHandler);
           process.stdin.pause();
           resolve({ loginMethod: userChoice });
         } else if (choice === '2') {
           userChoice = 'apikey';
           process.stdin.removeListener('data', inputHandler);
           process.stdin.pause();
           resolve({ loginMethod: userChoice });
         } else {
           console.log(centerText(chalk.red('Invalid choice. Please enter 1 or 2:'), terminalWidth));
         }
       };

       process.stdin.on('data', inputHandler);
     }
   });

  // make sure we actually got a choice from the user
  if (!response.loginMethod) {
    process.stdout.write('\x1Bc');
    process.exit(0);
  }

  // show a nice confirmation message
  console.log();
  const confirmationMsg = response.loginMethod === 'free'
    ? chalk.green('✓ Selected: Free API Login')
    : chalk.green('✓ Selected: API Key Login');
  console.log(centerText(confirmationMsg, terminalWidth));
  console.log();

  return response.loginMethod;
}
