// database class manages convex database connections
// todo implement actual convex db client setup
export class Database {
  constructor() {
    // basic database setup
  }

  // connects to convex database
  async connect(): Promise<void> {
    // todo initialize convex client
  }

  // closes database connection
  async disconnect(): Promise<void> {
    // todo cleanup connection
  }
}

export default Database;