import { readdir, stat, readFile } from 'fs/promises';
import { join, relative, basename, extname } from 'path';
import { existsSync } from 'fs';

// Scanner walks through directories and finds code files
export class Scanner {
  private gitignorePatterns: string[] = [];
  private defaultIgnorePatterns: string[] = [
    'node_modules',
    '.git',
    '.DS_Store',
    'dist',
    'build',
    'coverage',
    '.nyc_output',
    'logs',
    '*.log',
    '.env',
    '.env.local',
    '.env.*.local',
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock'
  ];

  private codeExtensions: Set<string> = new Set([
    '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
    '.py', '.rb', '.php', '.java', '.c', '.cpp', '.cc', '.cxx',
    '.h', '.hpp', '.cs', '.go', '.rs', '.swift', '.kt',
    '.scala', '.clj', '.hs', '.ml', '.fs', '.elm',
    '.dart', '.lua', '.r', '.m', '.mm', '.pl', '.sh',
    '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd',
    '.html', '.htm', '.css', '.scss', '.sass', '.less',
    '.json', '.xml', '.yaml', '.yml', '.toml', '.ini',
    '.md', '.mdx', '.txt', '.sql', '.graphql', '.gql'
  ]);

  constructor(rootPath?: string) {
    if (rootPath) {
      this.loadGitignore(rootPath);
    }
  }

  // Load and parse .gitignore file
  private async loadGitignore(rootPath: string): Promise<void> {
    const gitignorePath = join(rootPath, '.gitignore');

    if (existsSync(gitignorePath)) {
      try {
        const content = await readFile(gitignorePath, 'utf-8');
        this.gitignorePatterns = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'))
          .map(pattern => {
            // Convert gitignore patterns to regex-compatible patterns
            return pattern
              .replace(/\./g, '\\.')
              .replace(/\*/g, '.*')
              .replace(/\?/g, '.')
              .replace(/\//g, '[\\\\/]');
          });
      } catch (error) {
        console.warn(`Warning: Could not read .gitignore file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  // Check if a file/directory should be ignored
  private shouldIgnore(filePath: string, rootPath: string): boolean {
    const relativePath = relative(rootPath, filePath);
    const fileName = basename(filePath);

    // Check default ignore patterns
    for (const pattern of this.defaultIgnorePatterns) {
      if (pattern.includes('*')) {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        if (regex.test(fileName) || regex.test(relativePath)) {
          return true;
        }
      } else {
        if (fileName === pattern || relativePath.includes(pattern)) {
          return true;
        }
      }
    }

    // Check gitignore patterns
    for (const pattern of this.gitignorePatterns) {
      const regex = new RegExp('^' + pattern + '$');
      if (regex.test(relativePath) || regex.test(fileName)) {
        return true;
      }
    }

    return false;
  }

  // Check if file is a code file based on extension
  private isCodeFile(filePath: string): boolean {
    const ext = extname(filePath).toLowerCase();
    return this.codeExtensions.has(ext);
  }

  // Recursively scan directory and return list of code files
  async scanDirectory(path: string, options?: {
    maxDepth?: number;
    includeHidden?: boolean;
    customExtensions?: string[];
  }): Promise<string[]> {
    const maxDepth = options?.maxDepth ?? 10;
    const includeHidden = options?.includeHidden ?? false;

    if (options?.customExtensions) {
      options.customExtensions.forEach(ext => {
        this.codeExtensions.add(ext.startsWith('.') ? ext : `.${ext}`);
      });
    }

    const results: string[] = [];

    await this.scanRecursive(path, path, results, 0, maxDepth, includeHidden);

    return results.sort();
  }

  // Recursive helper function
  private async scanRecursive(
    currentPath: string,
    rootPath: string,
    results: string[],
    currentDepth: number,
    maxDepth: number,
    includeHidden: boolean
  ): Promise<void> {
    if (currentDepth > maxDepth) {
      return;
    }

    try {
      const entries = await readdir(currentPath);

      for (const entry of entries) {
        const fullPath = join(currentPath, entry);

        // Skip hidden files/directories unless explicitly included
        if (!includeHidden && entry.startsWith('.')) {
          continue;
        }

        // Skip if should be ignored
        if (this.shouldIgnore(fullPath, rootPath)) {
          continue;
        }

        try {
          const stats = await stat(fullPath);

          if (stats.isDirectory()) {
            // Recursively scan subdirectory
            await this.scanRecursive(
              fullPath,
              rootPath,
              results,
              currentDepth + 1,
              maxDepth,
              includeHidden
            );
          } else if (stats.isFile() && this.isCodeFile(fullPath)) {
            results.push(fullPath);
          }
        } catch (error) {
          // Skip files/directories that can't be accessed
          console.warn(`Warning: Could not access ${fullPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      throw new Error(`Failed to scan directory ${currentPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get file statistics
  async getFileStats(files: string[]): Promise<{
    totalFiles: number;
    totalSize: number;
    extensionCounts: Record<string, number>;
  }> {
    let totalSize = 0;
    const extensionCounts: Record<string, number> = {};

    for (const file of files) {
      try {
        const stats = await stat(file);
        totalSize += stats.size;

        const ext = extname(file).toLowerCase();
        extensionCounts[ext] = (extensionCounts[ext] || 0) + 1;
      } catch (error) {
        console.warn(`Warning: Could not get stats for ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      totalFiles: files.length,
      totalSize,
      extensionCounts
    };
  }

  // Add custom ignore patterns
  addIgnorePatterns(patterns: string[]): void {
    this.defaultIgnorePatterns.push(...patterns);
  }

  // Add custom file extensions
  addCodeExtensions(extensions: string[]): void {
    extensions.forEach(ext => {
      this.codeExtensions.add(ext.startsWith('.') ? ext : `.${ext}`);
    });
  }
}

export default Scanner;
