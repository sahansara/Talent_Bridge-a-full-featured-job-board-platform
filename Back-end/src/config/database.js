const { MongoClient } = require('mongodb');

// Database configuration
const DATABASE_CONFIG = {
  url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
  dbName: process.env.DB_NAME || 'talent_Bridge',
  options: {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 5,
    maxIdleTimeMS: 30000,
    retryWrites: true,
    retryReads: true,
  }
};

// Collection names
const COLLECTIONS = {
  SEEK_EMPLOYEES: 'seek_employees',
  COMPANIES: 'Companies',
  ADMINS: 'Admins',
};

class DatabaseConnection {
  constructor() {
    this.client = null;
    this.db = null;
    this.collections = {};
    this.maxRetries = 5;
    this.retryDelay = 5000; // 5 seconds
  }

  /**
   * Sleep utility for retry logic
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Connect to database with retry logic for Docker environments
   */
  async connect() {
    let lastError;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(` MongoDB connection attempt ${attempt}/${this.maxRetries}...`);
        console.log(` Connecting to: ${DATABASE_CONFIG.url}`);
        
        this.client = new MongoClient(DATABASE_CONFIG.url, DATABASE_CONFIG.options);
        await this.client.connect();
        
        this.db = this.client.db(DATABASE_CONFIG.dbName);
        
        // Initialize collections
        this.collections = {
          seekEmployees: this.db.collection(COLLECTIONS.SEEK_EMPLOYEES),
          companies: this.db.collection(COLLECTIONS.COMPANIES),
          admins: this.db.collection(COLLECTIONS.ADMINS),
        };

        // Test connection
        await this.db.admin().ping();
        console.log(` MongoDB connected successfully to database: ${DATABASE_CONFIG.dbName}`);

        return {
          db: this.db,
          collections: this.collections,
          client: this.client
        };

      } catch (error) {
        lastError = error;
        console.error(` MongoDB connection attempt ${attempt} failed:`, error.message);
        
        // Close failed client
        if (this.client) {
          try {
            await this.client.close();
          } catch (closeError) {
            // Ignore close errors
          }
          this.client = null;
        }
        
        // Wait before retrying (except on last attempt)
        if (attempt < this.maxRetries) {
          console.log(`⏳ Retrying in ${this.retryDelay / 1000} seconds...`);
          await this.sleep(this.retryDelay);
        }
      }
    }
    
    // All retries failed
    console.error(' All MongoDB connection attempts failed');
    throw new Error(`Database connection failed after ${this.maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Close database connection
   */
  async disconnect() {
    try {
      if (this.client) {
        await this.client.close();
        console.log('🔌 MongoDB connection closed');
      }
    } catch (error) {
      console.error('⚠️  Error closing MongoDB connection:', error);
    }
  }

  /**
   * Get database instance
   */
  getDatabase() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  /**
   * Get collections object
   */
  getCollections() {
    if (!this.collections || Object.keys(this.collections).length === 0) {
      throw new Error('Collections not initialized. Call connect() first.');
    }
    return this.collections;
  }

  /**
   * Get specific collection by name
   */
  getCollection(collectionName) {
    const collections = this.getCollections();
    
    if (!collections[collectionName]) {
      throw new Error(`Collection '${collectionName}' not found`);
    }
    
    return collections[collectionName];
  }

  /**
   * Check if database is connected
   */
  isConnected() {
    return this.client && this.db && this.client.topology && this.client.topology.isConnected();
  }

  /**
   * Health check for database connection
   */
  async healthCheck() {
    try {
      if (!this.isConnected()) {
        return {
          status: 'disconnected',
          message: 'Database is not connected'
        };
      }

      await this.db.admin().ping();
      
      return {
        status: 'connected',
        message: 'Database is healthy',
        dbName: this.db.databaseName,
        collections: Object.keys(this.collections)
      };

    } catch (error) {
      return {
        status: 'error',
        message: `Database health check failed: ${error.message}`
      };
    }
  }
}

// Create singleton instance
const databaseConnection = new DatabaseConnection();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('  SIGINT received, closing MongoDB connection...');
  await databaseConnection.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('  SIGTERM received, closing MongoDB connection...');
  await databaseConnection.disconnect();
  process.exit(0);
});

module.exports = {
  databaseConnection,
  DATABASE_CONFIG,
  COLLECTIONS
};