import { readFile } from 'fs/promises';
import { extname, basename } from 'path';

// File index entry interface
export interface FileIndex {
  path: string;
  name: string;
  extension: string;
  size: number;
  content: string;
  keywords: string[];
  functions: string[];
  classes: string[];
  imports: string[];
  exports: string[];
  lastModified: Date;
}

// Search result interface
export interface SearchResult {
  file: FileIndex;
  score: number;
  matches: {
    line: number;
    content: string;
    context: string;
  }[];
}

// Indexer creates searchable index of codebase files
export class Indexer {
  private index: Map<string, FileIndex> = new Map();
  private keywordIndex: Map<string, Set<string>> = new Map();
  private functionIndex: Map<string, Set<string>> = new Map();
  private classIndex: Map<string, Set<string>> = new Map();

  constructor() {
    // Initialize indexing system
  }

  // Takes list of files and creates searchable index
  async indexFiles(files: string[], options?: {
    maxFileSize?: number;
    skipBinaryFiles?: boolean;
  }): Promise<void> {
    const maxFileSize = options?.maxFileSize ?? 1024 * 1024; // 1MB default
    const skipBinaryFiles = options?.skipBinaryFiles ?? true;

    console.log(`Indexing ${files.length} files...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await this.indexFile(file, maxFileSize, skipBinaryFiles);

        // Progress indicator
        if ((i + 1) % 100 === 0 || i === files.length - 1) {
          console.log(`Indexed ${i + 1}/${files.length} files`);
        }
      } catch (error) {
        console.warn(`Warning: Could not index ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log(`Indexing complete. ${this.index.size} files indexed.`);
  }

  // Index a single file
  private async indexFile(filePath: string, maxFileSize: number, skipBinaryFiles: boolean): Promise<void> {
    try {
      const stats = await import('fs/promises').then(fs => fs.stat(filePath));

      // Skip large files
      if (stats.size > maxFileSize) {
        console.warn(`Skipping large file: ${filePath} (${stats.size} bytes)`);
        return;
      }

      const content = await readFile(filePath, 'utf-8');

      // Skip binary files if option is set
      if (skipBinaryFiles && this.isBinaryContent(content)) {
        return;
      }

      const fileIndex: FileIndex = {
        path: filePath,
        name: basename(filePath),
        extension: extname(filePath).toLowerCase(),
        size: stats.size,
        content,
        keywords: this.extractKeywords(content),
        functions: this.extractFunctions(content, extname(filePath)),
        classes: this.extractClasses(content, extname(filePath)),
        imports: this.extractImports(content, extname(filePath)),
        exports: this.extractExports(content, extname(filePath)),
        lastModified: stats.mtime
      };

      // Store in main index
      this.index.set(filePath, fileIndex);

      // Update keyword index
      fileIndex.keywords.forEach(keyword => {
        if (!this.keywordIndex.has(keyword)) {
          this.keywordIndex.set(keyword, new Set());
        }
        this.keywordIndex.get(keyword)!.add(filePath);
      });

      // Update function index
      fileIndex.functions.forEach(func => {
        if (!this.functionIndex.has(func)) {
          this.functionIndex.set(func, new Set());
        }
        this.functionIndex.get(func)!.add(filePath);
      });

      // Update class index
      fileIndex.classes.forEach(cls => {
        if (!this.classIndex.has(cls)) {
          this.classIndex.set(cls, new Set());
        }
        this.classIndex.get(cls)!.add(filePath);
      });
    } catch (error) {
      throw new Error(`Failed to index file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Check if content appears to be binary
  private isBinaryContent(content: string): boolean {
    // Simple heuristic: if more than 30% of characters are non-printable, consider it binary
    const nonPrintableCount = content.split('').filter(char => {
      const code = char.charCodeAt(0);
      return code < 32 && code !== 9 && code !== 10 && code !== 13; // Exclude tab, LF, CR
    }).length;

    return nonPrintableCount / content.length > 0.3;
  }

  // Extract keywords from content
  private extractKeywords(content: string): string[] {
    const words = content
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && word.length < 50)
      .filter(word => !/^\d+$/.test(word)); // Exclude pure numbers

    // Remove duplicates and return
    return [...new Set(words)];
  }

  // Extract function names based on file extension
  private extractFunctions(content: string, extension: string): string[] {
    const functions: string[] = [];

    switch (extension) {
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
        // JavaScript/TypeScript function patterns
        const jsFunctionRegex = /(?:function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)|([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[:=]\s*(?:async\s+)?(?:function|\([^)]*\)\s*=>))/g;
        let match;
        while ((match = jsFunctionRegex.exec(content)) !== null) {
          functions.push(match[1] || match[2]);
        }
        break;

      case '.py':
        // Python function pattern
        const pyFunctionRegex = /def\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
        while ((match = pyFunctionRegex.exec(content)) !== null) {
          functions.push(match[1]);
        }
        break;

      case '.java':
      case '.cs':
        // Java/C# method pattern
        const javaMethodRegex = /(?:public|private|protected|static)?\s*(?:\w+\s+)*([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*\{/g;
        while ((match = javaMethodRegex.exec(content)) !== null) {
          functions.push(match[1]);
        }
        break;
    }

    return [...new Set(functions)];
  }

  // Extract class names
  private extractClasses(content: string, extension: string): string[] {
    const classes: string[] = [];

    switch (extension) {
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
        const jsClassRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
        let match;
        while ((match = jsClassRegex.exec(content)) !== null) {
          classes.push(match[1]);
        }
        break;

      case '.py':
        const pyClassRegex = /class\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
        while ((match = pyClassRegex.exec(content)) !== null) {
          classes.push(match[1]);
        }
        break;

      case '.java':
      case '.cs':
        const javaClassRegex = /(?:public|private|protected)?\s*class\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
        while ((match = javaClassRegex.exec(content)) !== null) {
          classes.push(match[1]);
        }
        break;
    }

    return [...new Set(classes)];
  }

  // Extract import statements
  private extractImports(content: string, extension: string): string[] {
    const imports: string[] = [];

    switch (extension) {
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
        const jsImportRegex = /import\s+(?:[^\n]+\s+from\s+)?['"]([^'"]+)['"]/g;
        let match;
        while ((match = jsImportRegex.exec(content)) !== null) {
          imports.push(match[1]);
        }
        break;

      case '.py':
        const pyImportRegex = /(?:from\s+([\w.]+)\s+)?import\s+([\w.,\s]+)/g;
        while ((match = pyImportRegex.exec(content)) !== null) {
          imports.push(match[1] || match[2]);
        }
        break;
    }

    return [...new Set(imports)];
  }

  // Extract export statements
  private extractExports(content: string, extension: string): string[] {
    const exports: string[] = [];

    switch (extension) {
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
        const jsExportRegex = /export\s+(?:default\s+)?(?:class|function|const|let|var)?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
        let match;
        while ((match = jsExportRegex.exec(content)) !== null) {
          exports.push(match[1]);
        }
        break;
    }

    return [...new Set(exports)];
  }

  // Search the index
  search(query: string, options?: {
    maxResults?: number;
    fileExtensions?: string[];
    searchType?: 'content' | 'functions' | 'classes' | 'all';
  }): SearchResult[] {
    const maxResults = options?.maxResults ?? 50;
    const searchType = options?.searchType ?? 'all';
    const results: SearchResult[] = [];

    const queryLower = query.toLowerCase();

    for (const [filePath, fileIndex] of this.index) {
      // Filter by file extension if specified
      if (options?.fileExtensions && !options.fileExtensions.includes(fileIndex.extension)) {
        continue;
      }

      let score = 0;
      const matches: SearchResult['matches'] = [];

      // Search based on type
      if (searchType === 'all' || searchType === 'content') {
        // Search in content
        const lines = fileIndex.content.split('\n');
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(queryLower)) {
            score += 1;
            matches.push({
              line: index + 1,
              content: line.trim(),
              context: this.getContext(lines, index, 2)
            });
          }
        });

        // Search in keywords
        if (fileIndex.keywords.some(keyword => keyword.includes(queryLower))) {
          score += 2;
        }
      }

      if (searchType === 'all' || searchType === 'functions') {
        // Search in functions
        if (fileIndex.functions.some(func => func.toLowerCase().includes(queryLower))) {
          score += 5;
        }
      }

      if (searchType === 'all' || searchType === 'classes') {
        // Search in classes
        if (fileIndex.classes.some(cls => cls.toLowerCase().includes(queryLower))) {
          score += 5;
        }
      }

      if (score > 0) {
        results.push({
          file: fileIndex,
          score,
          matches
        });
      }
    }

    // Sort by score (descending) and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }

  // Get context around a line
  private getContext(lines: string[], lineIndex: number, contextSize: number): string {
    const start = Math.max(0, lineIndex - contextSize);
    const end = Math.min(lines.length, lineIndex + contextSize + 1);

    return lines.slice(start, end).join('\n');
  }

  // Get index statistics
  getStats(): {
    totalFiles: number;
    totalKeywords: number;
    totalFunctions: number;
    totalClasses: number;
    extensionCounts: Record<string, number>;
  } {
    const extensionCounts: Record<string, number> = {};

    for (const fileIndex of this.index.values()) {
      const ext = fileIndex.extension;
      extensionCounts[ext] = (extensionCounts[ext] || 0) + 1;
    }

    return {
      totalFiles: this.index.size,
      totalKeywords: this.keywordIndex.size,
      totalFunctions: this.functionIndex.size,
      totalClasses: this.classIndex.size,
      extensionCounts
    };
  }

  // Clear the index
  clear(): void {
    this.index.clear();
    this.keywordIndex.clear();
    this.functionIndex.clear();
    this.classIndex.clear();
  }

  // Get all indexed files
  getIndexedFiles(): FileIndex[] {
    return Array.from(this.index.values());
  }

  // Get file by path
  getFile(path: string): FileIndex | undefined {
    return this.index.get(path);
  }
}

export default Indexer;
