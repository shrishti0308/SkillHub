const redis = require("redis");
const util = require("util");
const { EventEmitter } = require("events");

// Check if Redis is installed and available
let redisClient;
let redisEnabled = false;

try {
  // Create Redis client with basic configuration
  redisClient = redis.createClient({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || "",
    retry_strategy: (options) => {
      if (options.error) {
        if (options.error.code === "ECONNREFUSED") {
          console.error("Redis connection refused. Retrying in 5 seconds...");
          return 5000;
        }
        return new Error("Redis connection error");
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error("Redis retry time exhausted");
      }
      return Math.min(options.attempt * 100, 3000);
    },
  });

  // Handle Redis events
  redisClient.on("connect", () => {
    console.log("Redis client connected");
    redisEnabled = true;
  });

  redisClient.on("error", (err) => {
    console.error("Redis client error:", err);
    redisEnabled = false;
  });
} catch (error) {
  console.error("Failed to initialize Redis client:", error);
  // Create a dummy client to prevent app crashes if Redis is unavailable
  redisClient = {
    get: (key, callback) => callback(null, null),
    set: (key, value, flag, expiry, callback) => callback(null, "OK"),
    setex: (key, expiry, value, callback) => callback(null, "OK"),
    del: (key, callback) => callback(null, 0),
    exists: (key, callback) => callback(null, 0),
    expire: (key, seconds, callback) => callback(null, 1),
    flushall: (callback) => callback(null, "OK"),
    info: (callback) => callback(null, ""),
    dbsize: (callback) => callback(null, 0),
    pipeline: () => ({
      del: () => ({}),
      exec: () => Promise.resolve([]),
    }),
    scanStream: () => {
      // Create a dummy event emitter that emits no data and ends immediately
      const emitter = new EventEmitter();
      setTimeout(() => {
        emitter.emit("data", []);
        emitter.emit("end");
      }, 0);
      return emitter;
    },
  };
}

// Simple wrapper functions that will work whether Redis is available or not
const getAsync = (key) => {
  if (!redisEnabled) return Promise.resolve(null);
  return util.promisify(redisClient.get).bind(redisClient)(key);
};

const setAsync = (key, value, flag, expiry) => {
  if (!redisEnabled) return Promise.resolve("OK");
  if (flag === "EX" && expiry) {
    return util.promisify(redisClient.setex).bind(redisClient)(
      key,
      expiry,
      value
    );
  }
  return util.promisify(redisClient.set).bind(redisClient)(key, value);
};

const delAsync = (key) => {
  if (!redisEnabled) return Promise.resolve(0);
  return util.promisify(redisClient.del).bind(redisClient)(key);
};

const existsAsync = (key) => {
  if (!redisEnabled) return Promise.resolve(0);
  return util.promisify(redisClient.exists).bind(redisClient)(key);
};

const flushallAsync = () => {
  if (!redisEnabled) return Promise.resolve("OK");
  return util.promisify(redisClient.flushall).bind(redisClient)();
};

const infoAsync = () => {
  if (!redisEnabled) return Promise.resolve("");
  return util.promisify(redisClient.info).bind(redisClient)();
};

const dbsizeAsync = () => {
  if (!redisEnabled) return Promise.resolve(0);
  return util.promisify(redisClient.dbsize).bind(redisClient)();
};

module.exports = {
  redisClient,
  redisEnabled,
  getAsync,
  setAsync,
  delAsync,
  existsAsync,
  flushallAsync,
  infoAsync,
  dbsizeAsync,
  // Default cache expiry in seconds
  DEFAULT_EXPIRY: 3600, // 1 hour
};
