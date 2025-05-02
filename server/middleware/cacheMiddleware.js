const {
  getAsync,
  setAsync,
  redisEnabled,
  DEFAULT_EXPIRY,
} = require("../config/redis");

/**
 * Middleware to cache API responses in Redis
 * @param {number} expiry - Cache expiry time in seconds (optional)
 * @returns {function} Express middleware
 */
const cacheMiddleware = (expiry = DEFAULT_EXPIRY) => {
  return async (req, res, next) => {
    // Skip if Redis is not available
    if (!redisEnabled) {
      return next();
    }

    // Skip caching for non-GET requests or authenticated routes
    if (req.method !== "GET" || req.originalUrl.includes("/user/profile")) {
      return next();
    }

    // Skip caching for routes that require fresh data
    if (req.headers["x-skip-cache"] === "true") {
      return next();
    }

    try {
      // Create a unique cache key based on the request
      // For auth endpoints, include user ID in the key to avoid sharing sensitive data
      const userId = req.user ? req.user.id : "anonymous";
      const cacheKey = `api:${userId}:${req.originalUrl}`;

      // Try to get cached response
      const cachedResponse = await getAsync(cacheKey);

      if (cachedResponse) {
        try {
          // Parse the cached response
          const parsedResponse = JSON.parse(cachedResponse);

          // Return the cached response
          return res.status(200).json({
            ...parsedResponse,
            cached: true,
          });
        } catch (parseError) {
          console.error("Error parsing cached response:", parseError);
          // If we can't parse the cached response, proceed to the controller
        }
      }

      // Cache miss - proceed to controller but intercept the response
      const originalSend = res.send;

      res.send = function (body) {
        // Only cache successful responses
        if (res.statusCode === 200) {
          // Don't try to cache if body is not valid JSON
          try {
            // Don't cache error responses
            const responseBody =
              typeof body === "string" ? JSON.parse(body) : body;

            if (
              !responseBody.error &&
              !responseBody.message?.includes("error")
            ) {
              // Store in cache - with error handling
              setAsync(
                cacheKey,
                JSON.stringify(responseBody),
                "EX",
                expiry
              ).catch((err) => console.error("Redis cache error:", err));
            }
          } catch (error) {
            // Silently fail if we can't cache - just log the error
            console.error("Error parsing response for caching:", error);
          }
        }

        // Call the original send method
        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      // If there's any error in the caching process, just log it and proceed normally
      console.error("Redis cache middleware error:", error);
      next();
    }
  };
};

/**
 * Cache middleware for specific endpoints with custom expiry times
 */
const routeCache = {
  // Public data that changes infrequently (1 day)
  longTerm: cacheMiddleware(86400),

  // Standard cache for most endpoints (1 hour)
  standard: cacheMiddleware(3600),

  // Short-term cache for frequently changing data (5 minutes)
  shortTerm: cacheMiddleware(300),

  // Very short cache for highly dynamic data (30 seconds)
  dynamic: cacheMiddleware(30),
};

module.exports = {
  cacheMiddleware,
  routeCache,
};
