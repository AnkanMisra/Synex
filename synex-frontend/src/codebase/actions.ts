import { OpenRouter } from '../models/openrouter.js';
import { Scanner } from './scanner.js';
import { Indexer, FileIndex, SearchResult } from './indexer.js';
import { Database } from '../convex/db.js';

// Action types that can be performed on the codebase
export type ActionType =
  | 'analyze'
  | 'search'
  | 'explain'
  | 'refactor'
  | 'generate'
  | 'debug'
  | 'optimize'
  | 'document';

// Action request interface
export interface ActionRequest {
  type: ActionType;
  query: string;
  context?: {
    files?: string[];
    functions?: string[];
    classes?: string[];
    scope?: 'file' | 'directory' | 'project';
  };
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    includeContext?: boolean;
  };
}

// Action result interface
export interface ActionResult {
  success: boolean;
  type: ActionType;
  query: string;
  response: string;
  context?: {
    filesAnalyzed: string[];
    relevantFiles: FileIndex[];
    searchResults?: SearchResult[];
  };
  metadata?: {
    model: string;
    tokensUsed: number;
    processingTime: number;
    timestamp: Date;
  };
  error?: string;
}

// Action processor handles different types of codebase actions
export class ActionProcessor {
  private openRouter: OpenRouter;
  private scanner: Scanner;
  private indexer: Indexer;
  private database: Database;
  private isIndexed: boolean = false;

  constructor(
    openRouter: OpenRouter,
    scanner: Scanner,
    indexer: Indexer,
    database: Database
  ) {
    this.openRouter = openRouter;
    this.scanner = scanner;
    this.indexer = indexer;
    this.database = database;
  }

  // Process an action request
  async processAction(request: ActionRequest): Promise<ActionResult> {
    const startTime = Date.now();

    try {
      // Ensure codebase is indexed
      await this.ensureIndexed();

      // Get relevant context based on the action type and query
      const context = await this.gatherContext(request);

      // Generate the appropriate prompt for the action
      const prompt = this.generatePrompt(request, context);

      // Query the LLM
      const response = await this.openRouter.query(prompt, {
        model: request.options?.model,
        maxTokens: request.options?.maxTokens,
        temperature: request.options?.temperature
      });

      const processingTime = Date.now() - startTime;

      const result: ActionResult = {
        success: true,
        type: request.type,
        query: request.query,
        response: response,
        context: {
          filesAnalyzed: context.files.map(f => f.path),
          relevantFiles: context.files,
          searchResults: context.searchResults
        },
        metadata: {
          model: request.options?.model || 'default',
          tokensUsed: 0, // TODO: Extract from response when available
          processingTime,
          timestamp: new Date()
        }
      };

      // Store the action in Convex for history
      await this.storeAction(result);

      return result;
    } catch (error) {
      const processingTime = Date.now() - startTime;

      return {
        success: false,
        type: request.type,
        query: request.query,
        response: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          model: request.options?.model || 'unknown',
          tokensUsed: 0,
          processingTime,
          timestamp: new Date()
        }
      };
    }
  }

  // Ensure the codebase is indexed
  private async ensureIndexed(): Promise<void> {
    if (this.isIndexed) {
      return;
    }

    console.log('Indexing codebase...');
    const files = await this.scanner.scanDirectory(process.cwd(), {
      maxDepth: 10,
      includeHidden: false
    });

    await this.indexer.indexFiles(files, {
      maxFileSize: 1024 * 1024, // 1MB
      skipBinaryFiles: true
    });

    this.isIndexed = true;
    console.log('Codebase indexing complete.');
  }

  // Gather relevant context for the action
  private async gatherContext(request: ActionRequest): Promise<{
    files: FileIndex[];
    searchResults?: SearchResult[];
  }> {
    let relevantFiles: FileIndex[] = [];
    let searchResults: SearchResult[] | undefined;

    // If specific files are mentioned in context, use those
    if (request.context?.files && request.context.files.length > 0) {
      relevantFiles = request.context.files
        .map(path => this.indexer.getFile(path))
        .filter((file): file is FileIndex => file !== undefined);
    } else {
      // Search for relevant files based on the query
      searchResults = this.indexer.search(request.query, {
        maxResults: 10,
        searchType: this.getSearchType(request.type)
      });

      relevantFiles = searchResults.map(result => result.file);
    }

    // If no relevant files found, get a sample of files from the project
    if (relevantFiles.length === 0) {
      const allFiles = this.indexer.getIndexedFiles();
      relevantFiles = allFiles.slice(0, 5); // Take first 5 files as fallback
    }

    return { files: relevantFiles, searchResults };
  }

  // Get appropriate search type based on action type
  private getSearchType(actionType: ActionType): 'content' | 'functions' | 'classes' | 'all' {
    switch (actionType) {
      case 'refactor':
      case 'debug':
      case 'optimize':
        return 'functions';
      case 'explain':
        return 'classes';
      case 'search':
      case 'analyze':
      case 'generate':
      case 'document':
      default:
        return 'all';
    }
  }

  // Generate appropriate prompt based on action type
  private generatePrompt(request: ActionRequest, context: { files: FileIndex[] }): string {
    const baseContext = this.formatFileContext(context.files);

    switch (request.type) {
      case 'analyze':
        return `Analyze the following codebase and provide insights about: ${request.query}

${baseContext}

Please provide a detailed analysis focusing on code structure, patterns, potential issues, and recommendations.`;

      case 'search':
        return `Search through the codebase for: ${request.query}

${baseContext}

Please identify relevant code sections, functions, classes, or patterns that match the search criteria.`;

      case 'explain':
        return `Explain the following code or concept: ${request.query}

${baseContext}

Please provide a clear, detailed explanation of how this code works, its purpose, and any important details.`;

      case 'refactor':
        return `Suggest refactoring improvements for: ${request.query}

${baseContext}

Please provide specific refactoring suggestions with code examples, focusing on improving code quality, maintainability, and performance.`;

      case 'generate':
        return `Generate code for: ${request.query}

${baseContext}

Please generate appropriate code that fits with the existing codebase style and patterns. Include proper error handling and documentation.`;

      case 'debug':
        return `Help debug the following issue: ${request.query}

${baseContext}

Please identify potential bugs, suggest fixes, and provide debugging strategies.`;

      case 'optimize':
        return `Suggest performance optimizations for: ${request.query}

${baseContext}

Please identify performance bottlenecks and suggest specific optimizations with code examples.`;

      case 'document':
        return `Generate documentation for: ${request.query}

${baseContext}

Please create comprehensive documentation including function descriptions, parameters, return values, and usage examples.`;

      default:
        return `Process the following request: ${request.query}

${baseContext}

Please provide a helpful response based on the codebase context.`;
    }
  }

  // Format file context for the prompt
  private formatFileContext(files: FileIndex[]): string {
    if (files.length === 0) {
      return 'No relevant files found in the codebase.';
    }

    let context = 'Relevant codebase files:\n\n';

    files.forEach((file, index) => {
      context += `## File ${index + 1}: ${file.name} (${file.path})\n`;
      context += `Extension: ${file.extension}\n`;
      context += `Size: ${file.size} bytes\n`;

      if (file.functions.length > 0) {
        context += `Functions: ${file.functions.join(', ')}\n`;
      }

      if (file.classes.length > 0) {
        context += `Classes: ${file.classes.join(', ')}\n`;
      }

      if (file.imports.length > 0) {
        context += `Imports: ${file.imports.slice(0, 5).join(', ')}${file.imports.length > 5 ? '...' : ''}\n`;
      }

      // Include file content (truncated if too long)
      const maxContentLength = 2000;
      const content = file.content.length > maxContentLength
        ? file.content.substring(0, maxContentLength) + '\n\n... (content truncated)'
        : file.content;

      context += `\nContent:\n\`\`\`${file.extension.substring(1)}\n${content}\n\`\`\`\n\n`;
    });

    return context;
  }

  // Store action result in database
  private async storeAction(result: ActionResult): Promise<void> {
    try {
      // TODO: Implement database storage when convex client is ready
      console.log('Action stored locally:', {
        type: result.type,
        query: result.query,
        success: result.success,
        timestamp: result.metadata?.timestamp || new Date()
      });
    } catch (error) {
      console.warn('Failed to store action:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // Get action history from database
  async getActionHistory(limit: number = 10): Promise<ActionResult[]> {
    try {
      // TODO: Implement database retrieval when convex client is ready
      console.log('Retrieving action history (limit:', limit, ')');
      return [];
    } catch (error) {
      console.warn('Failed to retrieve action history:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  // Clear the indexer cache (useful when files change)
  clearCache(): void {
    this.indexer.clear();
    this.isIndexed = false;
  }

  // Get indexer statistics
  getIndexStats() {
    return this.indexer.getStats();
  }

  // Validate action request
  static validateRequest(request: ActionRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.type) {
      errors.push('Action type is required');
    }

    if (!request.query || request.query.trim().length === 0) {
      errors.push('Query is required and cannot be empty');
    }

    const validTypes: ActionType[] = ['analyze', 'search', 'explain', 'refactor', 'generate', 'debug', 'optimize', 'document'];
    if (request.type && !validTypes.includes(request.type)) {
      errors.push(`Invalid action type. Must be one of: ${validTypes.join(', ')}`);
    }

    if (request.options?.maxTokens && (request.options.maxTokens < 1 || request.options.maxTokens > 4000)) {
      errors.push('maxTokens must be between 1 and 4000');
    }

    if (request.options?.temperature && (request.options.temperature < 0 || request.options.temperature > 2)) {
      errors.push('temperature must be between 0 and 2');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default ActionProcessor;
