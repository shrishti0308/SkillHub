const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

// Set the Node environment to test
process.env.NODE_ENV = "test";

// Disable the actual server connection in tests
const originalConnect = mongoose.connect;
let mongoServer;

// Mock console methods to reduce noise during tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Set up MongoDB memory server before all tests
beforeAll(async () => {
  // Mock console methods
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();

  // Close any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Create a new in-memory server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log = originalConsoleLog;
});

// Clear all test data after each test
afterEach(async () => {
  console.log = jest.fn();
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
  console.log = originalConsoleLog;
});

// Stop MongoDB and close connection
afterAll(async () => {
  console.log = jest.fn();
  console.error = jest.fn();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }

  // Restore original console methods
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
}, 30000); // Increase timeout to 30 seconds
