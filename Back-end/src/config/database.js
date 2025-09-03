
const { MongoClient } = require('mongodb');

// Database configuration
const DATABASE_CONFIG = {
  url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
  dbName: process.env.DB_NAME || 'talent_Bridge',
  options: {
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 5, // Maintain a minimum of 5 socket connections
    maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
   
  }
};

// Collection names - centralized for consistency
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
  }

  async connect() {
    try {
      
      
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
     

      return {
        db: this.db,
        collections: this.collections,
        client: this.client
      };

    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  /**
   * Close database connection
   */
  async disconnect() {
    try {
      if (this.client) {
        await this.client.close();
        
      }
    } catch (error) {
      console.error(' Error closing MongoDB connection:', error);
    }
  }

  /**
   * Get database instance
   * @returns {object} Database instance
   */
  getDatabase() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  /**
   * Get collections object
   * @returns {object} Collections object
   */
  getCollections() {
    if (!this.collections || Object.keys(this.collections).length === 0) {
      throw new Error('Collections not initialized. Call connect() first.');
    }
    return this.collections;
  }

  /**
   * Get specific collection by name
   * @param {string} collectionName - Name of the collection
   * @returns {object} MongoDB collection instance
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
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.client && this.db && this.client.topology && this.client.topology.isConnected();
  }

  /**
   * Health check for database connection
   * @returns {Promise<object>} Health status
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
  
  await databaseConnection.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  
  await databaseConnection.disconnect();
  process.exit(0);
});

module.exports = {
  databaseConnection,
  DATABASE_CONFIG,
  
};