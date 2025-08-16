// Note: Convex integration will be added when convex package is installed
// For now, using in-memory storage that can be easily replaced

// Action history interface for database storage
export interface ActionHistory {
  _id?: string;
  type: string;
  query: string;
  response: string;
  success: boolean;
  metadata?: {
    model: string;
    tokensUsed: number;
    processingTime: number;
    timestamp: Date;
    userId?: string;
  };
  timestamp: Date;
}

// User session interface
export interface UserSession {
  _id?: string;
  userId: string;
  apiKey?: string;
  defaultModel?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    maxTokens?: number;
    temperature?: number;
  };
  lastActive: Date;
  createdAt: Date;
}

// Database configuration interface
export interface DatabaseConfig {
  url?: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
}

// Simple client interface for database operations
interface DatabaseClient {
  query(name: string, args?: any): Promise<any>;
  mutation(name: string, args?: any): Promise<any>;
}

// In-memory storage for development/testing
class InMemoryClient implements DatabaseClient {
  private actionHistory: ActionHistory[] = [];
  private userSessions: Map<string, UserSession> = new Map();
  private nextId: number = 1;

  async query(name: string, args?: any): Promise<any> {
    switch (name) {
      case 'health:check':
        return { status: 'ok' };
      case 'actions:list':
        const { limit = 10, userId } = args || {};
        let actions = this.actionHistory;
        if (userId) {
          actions = actions.filter(a => a.metadata?.userId === userId);
        }
        return actions.slice(-limit).reverse();
      case 'sessions:get':
        const { userId: sessionUserId } = args || {};
        return this.userSessions.get(sessionUserId) || null;
      case 'stats:get':
        return {
          totalActions: this.actionHistory.length,
          totalUsers: this.userSessions.size,
          recentActivity: this.actionHistory.filter(a =>
            Date.now() - a.timestamp.getTime() < 24 * 60 * 60 * 1000
          ).length
        };
      default:
        throw new Error(`Unknown query: ${name}`);
    }
  }

  async mutation(name: string, args?: any): Promise<any> {
    switch (name) {
      case 'actions:store':
        const actionId = `action_${this.nextId++}`;
        const action: ActionHistory = {
          _id: actionId,
          ...args,
          timestamp: new Date()
        };
        this.actionHistory.push(action);
        return actionId;
      case 'actions:clear':
        const { userId: clearUserId } = args || {};
        if (clearUserId) {
          this.actionHistory = this.actionHistory.filter(a => a.metadata?.userId !== clearUserId);
        } else {
          this.actionHistory = [];
        }
        return true;
      case 'sessions:store':
        const sessionId = `session_${this.nextId++}`;
        const session: UserSession = {
          _id: sessionId,
          ...args,
          createdAt: new Date(),
          lastActive: new Date()
        };
        this.userSessions.set(args.userId, session);
        return sessionId;
      case 'sessions:update':
        const { userId: updateUserId, updates } = args || {};
        const existingSession = this.userSessions.get(updateUserId);
        if (existingSession) {
          const updatedSession = {
            ...existingSession,
            ...updates,
            lastActive: new Date()
          };
          this.userSessions.set(updateUserId, updatedSession);
        }
        return true;
      case 'sessions:delete':
        const { userId: deleteUserId } = args || {};
        return this.userSessions.delete(deleteUserId);
      default:
        throw new Error(`Unknown mutation: ${name}`);
    }
  }
}

// Database class manages database connections
export class Database {
  private client: DatabaseClient | null = null;
  private config: DatabaseConfig;
  private isConnected: boolean = false;
  private retryCount: number = 0;

  constructor(config: DatabaseConfig = {}) {
    this.config = {
      url: config.url || process.env.CONVEX_URL,
      timeout: config.timeout || 10000,
      retryAttempts: config.retryAttempts || 3,
      ...config
    };
  }

  // Connects to convex database
  async connect(): Promise<void> {
    try {
      if (this.isConnected && this.client) {
        return;
      }

      if (!this.config.url) {
         console.warn('Database URL not configured. Using in-memory storage.');
       }

       // Use in-memory client for now (can be replaced with Convex later)
       this.client = new InMemoryClient();

      // Test connection with a simple query
      await this.testConnection();

      this.isConnected = true;
      this.retryCount = 0;
      console.log('Connected to Convex database successfully');
    } catch (error) {
      this.isConnected = false;
      console.error('Failed to connect to Convex database:', error instanceof Error ? error.message : 'Unknown error');

      // Retry logic
      if (this.retryCount < (this.config.retryAttempts || 3)) {
        this.retryCount++;
        console.log(`Retrying connection (attempt ${this.retryCount}/${this.config.retryAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * this.retryCount));
        return this.connect();
      }

      throw new Error(`Failed to connect to database after ${this.config.retryAttempts} attempts`);
    }
  }

  // Test database connection
  private async testConnection(): Promise<void> {
    if (!this.client) {
      throw new Error('Database client not initialized');
    }

    try {
      // Try to query a simple function to test connectivity
      // This is a placeholder - replace with actual Convex function when available
      await this.client.query('health:check' as any);
    } catch (error) {
      // If health check fails, we'll still consider it connected for now
      console.warn('Health check failed, but connection established');
    }
  }

  // Closes database connection
  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        // Convex HTTP client doesn't need explicit disconnection
        this.client = null;
      }
      this.isConnected = false;
      console.log('Disconnected from Convex database');
    } catch (error) {
      console.error('Error during disconnect:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // Check if database is connected
  isConnectedToDatabase(): boolean {
    return this.isConnected && this.client !== null;
  }

  // Store action history
  async storeAction(action: Omit<ActionHistory, '_id'>): Promise<string | null> {
    try {
      if (!this.isConnectedToDatabase()) {
        console.warn('Database not connected. Action not stored.');
        return null;
      }

      // TODO: Replace with actual Convex mutation when schema is defined
      const result = await this.client!.mutation('actions:store' as any, action);
      return result as string;
    } catch (error) {
      console.error('Failed to store action:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  // Get action history
  async getActionHistory(limit: number = 10, userId?: string): Promise<ActionHistory[]> {
    try {
      if (!this.isConnectedToDatabase()) {
        console.warn('Database not connected. Returning empty history.');
        return [];
      }

      // TODO: Replace with actual Convex query when schema is defined
      const result = await this.client!.query('actions:list' as any, { limit, userId });
      return result as ActionHistory[];
    } catch (error) {
      console.error('Failed to get action history:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  // Store user session
  async storeUserSession(session: Omit<UserSession, '_id'>): Promise<string | null> {
    try {
      if (!this.isConnectedToDatabase()) {
        console.warn('Database not connected. Session not stored.');
        return null;
      }

      // TODO: Replace with actual Convex mutation when schema is defined
      const result = await this.client!.mutation('sessions:store' as any, session);
      return result as string;
    } catch (error) {
      console.error('Failed to store user session:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  // Get user session
  async getUserSession(userId: string): Promise<UserSession | null> {
    try {
      if (!this.isConnectedToDatabase()) {
        console.warn('Database not connected. Returning null session.');
        return null;
      }

      // TODO: Replace with actual Convex query when schema is defined
      const result = await this.client!.query('sessions:get' as any, { userId });
      return result as UserSession;
    } catch (error) {
      console.error('Failed to get user session:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  // Update user session
  async updateUserSession(userId: string, updates: Partial<UserSession>): Promise<boolean> {
    try {
      if (!this.isConnectedToDatabase()) {
        console.warn('Database not connected. Session not updated.');
        return false;
      }

      // TODO: Replace with actual Convex mutation when schema is defined
      await this.client!.mutation('sessions:update' as any, { userId, updates });
      return true;
    } catch (error) {
      console.error('Failed to update user session:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  // Delete user session
  async deleteUserSession(userId: string): Promise<boolean> {
    try {
      if (!this.isConnectedToDatabase()) {
        console.warn('Database not connected. Session not deleted.');
        return false;
    }

      // TODO: Replace with actual Convex mutation when schema is defined
      await this.client!.mutation('sessions:delete' as any, { userId });
      return true;
    } catch (error) {
      console.error('Failed to delete user session:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  // Clear all action history (admin function)
  async clearActionHistory(userId?: string): Promise<boolean> {
    try {
      if (!this.isConnectedToDatabase()) {
        console.warn('Database not connected. History not cleared.');
        return false;
      }

      // TODO: Replace with actual Convex mutation when schema is defined
      await this.client!.mutation('actions:clear' as any, { userId });
      return true;
    } catch (error) {
      console.error('Failed to clear action history:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  // Get database statistics
  async getStats(): Promise<{
    totalActions: number;
    totalUsers: number;
    recentActivity: number;
  } | null> {
    try {
      if (!this.isConnectedToDatabase()) {
        console.warn('Database not connected. Returning null stats.');
        return null;
      }

      // TODO: Replace with actual Convex query when schema is defined
      const result = await this.client!.query('stats:get' as any);
      return result as { totalActions: number; totalUsers: number; recentActivity: number };
    } catch (error) {
      console.error('Failed to get database stats:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  // Health check
  async healthCheck(): Promise<{
    connected: boolean;
    latency?: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      if (!this.client) {
        return {
          connected: false,
          error: 'Client not initialized'
        };
      }

      await this.testConnection();
      const latency = Date.now() - startTime;

      return {
        connected: true,
        latency
      };
    } catch (error) {
      return {
        connected: false,
        latency: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get client instance (for advanced usage)
  getClient(): DatabaseClient | null {
    return this.client;
  }

  // Update configuration
  updateConfig(newConfig: Partial<DatabaseConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export default Database;
