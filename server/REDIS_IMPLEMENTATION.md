# Redis Implementation in SkillHub

This document outlines the Redis caching implementation in the SkillHub application.

## Setup and Configuration

### Installation

1. Redis was installed using npm:
   ```bash
   npm install redis
   ```

2. Additional helper packages were added:
   ```bash
   npm install mongoose-lean-virtuals mongoose-lean-defaults mongoose-lean-getters
   ```

### Configuration File

The Redis configuration is stored in `/config/redis.js`:

```javascript
const redis = require('redis');
const { promisify } = require('util');

// Create Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
  retry_strategy: (options) => {
    // Retry strategy to handle connection issues
    // ...
  }
});

// Promisify Redis commands
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
// ... more promisified commands

module.exports = {
  redisClient,
  getAsync,
  setAsync,
  // ... more exports
  DEFAULT_EXPIRY: 3600 // 1 hour default cache expiry
};
```

## Caching Architecture

### Middleware Approach

SkillHub implements Redis caching through middleware that sits between the route and controller:

```javascript
// Example usage in routes
router.get("/marketplace", routeCache.standard, getMarketplaceJobs);
```

### Caching Middleware

The caching middleware `/middleware/cacheMiddleware.js` handles:

1. **Generating Cache Keys**: Creates unique keys based on the request URL and user ID
2. **Cache Retrieval**: Checks if a response exists in the cache
3. **Cache Storage**: Stores successful responses in the cache
4. **Different Cache Durations**: Provides various expiration times based on data volatility

### Cache Invalidation

The utils `/utils/cacheUtils.js` provides functions for invalidating cache entries when data changes:

1. **By User**: Invalidate all cache entries for a specific user
2. **By Resource**: Invalidate cache for specific resources (e.g., jobs, bids)
3. **By Endpoint**: Invalidate cache for specific API endpoints
4. **By Key**: Invalidate specific cache entries

## Cache Types

Different cache durations are implemented based on data characteristics:

| Cache Type | Duration       | Use Case                    |
| ---------- | -------------- | --------------------------- |
| Long-term  | 86400s (1 day) | Static data, reference data |
| Standard   | 3600s (1 hour) | General-purpose caching     |
| Short-term | 300s (5 min)   | Frequently changing data    |
| Dynamic    | 30s (30 sec)   | Highly volatile data        |

Example usage:
```javascript
// Cache jobs marketplace for 1 hour
router.get("/marketplace", routeCache.standard, getMarketplaceJobs);

// Cache filtered jobs for 5 minutes
router.get("/jobs/filtered", authenticateJWT, routeCache.shortTerm, getFilteredJobs);
```

## Cache Integration with API Endpoints

### Route Integration

Redis caching is applied to the following endpoints:

1. **Job Routes**:
   - `/jobs/marketplace`: Standard caching (1 hour)
   - `/jobs/:id`: Standard caching (1 hour)
   - `/jobs/filtered`: Short-term caching (5 minutes)

2. **User Routes**:
   - User profiles
   - User job listings

3. **Bid Routes**:
   - Recent bids
   - Bid listings

### Cache Invalidation on Data Mutation

For POST, PUT, and DELETE operations, cache invalidation is implemented:

```javascript
router.post("/create", authenticateJWT, async (req, res, next) => {
  try {
    await createJob(req, res, next);
    // Invalidate relevant caches after successful job creation
    await invalidateResourceCache('job', '');
  } catch (error) {
    next(error);
  }
});
```

## Performance Monitoring

A performance monitoring endpoint is available at `/system/performance` which provides:

1. **Redis Cache Statistics**:
   - Cache hits
   - Number of keys
   - Memory usage

2. **MongoDB Statistics**:
   - Collection information
   - Index information
   - Database size

## Testing and Performance Evaluation

A performance testing script is available at `/scripts/performanceTest.js` which:

1. Tests endpoints with and without caching
2. Measures response times
3. Calculates performance improvements
4. Generates performance reports

## Best Practices

The SkillHub Redis implementation follows these best practices:

1. **Error Handling**: Graceful fallback to database if Redis fails
2. **Proper Serialization**: Safe JSON serialization and deserialization
3. **Selective Caching**: Only cache GET requests with successful responses
4. **Key Namespacing**: Organized key structure for easier management
5. **Cache Timeouts**: Appropriate expiration times based on data volatility
6. **Graceful Shutdown**: Proper connection closure on application shutdown

## Monitoring and Debugging

### Redis Commands Monitor

The Redis Commander tool can be used to monitor and manage the Redis cache:

```bash
npx redis-commander
```

This provides a web interface at http://localhost:8081 to:
- View all keys
- Check memory usage
- Delete keys manually
- Execute Redis commands

### Cache Flush Endpoint

A development-only endpoint is available to flush the Redis cache:

```
POST /system/flush-cache
```

This is useful during testing and development to reset the cache state.

## Local Development

For local development:

1. Ensure Redis is installed and running locally
2. Set up environment variables in `.env`:
   ```
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   ```

## Production Considerations

For production deployment:

1. Consider using a managed Redis service (e.g., Redis Cloud, AWS ElastiCache)
2. Implement Redis Sentinel or Redis Cluster for high availability
3. Monitor memory usage to prevent out-of-memory issues
4. Set up alerts for Redis connection failures
5. Implement rate limiting with Redis to protect the API 