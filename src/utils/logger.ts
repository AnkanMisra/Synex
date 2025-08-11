// simple logger class for console output
// keeps things organized with different log levels
export class Logger {
  constructor() {
    // nothing special needed for basic console logging
  }

  // regular info messages
  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  // error messages in red
  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }

  // warning messages in yellow
  warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }
}

export default Logger;
