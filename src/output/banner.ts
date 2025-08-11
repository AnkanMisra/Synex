// ascii art banner for synex logo
// using chalk for cyan coloring
import chalk from 'chalk';

// synex logo in ascii art format
export const SYNEX_LOGO = [
  "  ███████╗██╗   ██╗███╗   ██╗███████╗██╗  ██╗  ",
  "  ██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝╚██╗██╔╝  ",
  "  ███████╗ ╚████╔╝ ██╔██╗ ██║█████╗   ╚███╔╝   ",
  "  ╚════██║  ╚██╔╝  ██║╚██╗██║██╔══╝   ██╔██╗   ",
  "  ███████║   ██║   ██║ ╚████║███████╗██╔╝ ██╗  ",
  "  ╚══════╝   ╚═╝   ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝  "
];

const banner = [
  "",
  ...SYNEX_LOGO,
  "",
];

// displays the banner with rainbow gradient colors
export function showBanner(): void {
  const colors = [
    chalk.red,
    chalk.yellow,
    chalk.green,
    chalk.cyan,
    chalk.blue,
    chalk.magenta
  ];
  
  banner.forEach((line, index) => {
    if (line.trim() === '') {
      console.log(line);
    } else {
      // cycle through colors for each line of the logo
      const colorIndex = (index - 1) % colors.length;
      console.log(colors[colorIndex](line));
    }
  });
  console.log(); // extra space after banner
}