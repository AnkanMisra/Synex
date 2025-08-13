// scanner walks through directories and finds code files
// todo implement proper file filtering and gitignore support
export class Scanner {
  constructor() {
    // basic directory scanning setup
  }

  // scans directory and returns list of code files
  async scanDirectory(path: string): Promise<string[]> {
    // todo recursively scan and filter files
    return [];
  }
}

export default Scanner;