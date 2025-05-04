const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  redisClient,
  redisEnabled,
  flushallAsync,
  infoAsync,
  dbsizeAsync,
} = require("../config/redis");

/**
 * @swagger
 * tags:
 *   - name: System
 *     description: System health and maintenance operations
 */

/**
 * @swagger
 * /system/status:
 *   get:
 *     summary: Get system status information
 *     description: Returns the current status of Redis, MongoDB connections and other system metrics
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System status information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 redis:
 *                   type: string
 *                   example: connected
 *                   description: Redis connection status (connected/disconnected)
 *                 mongodb:
 *                   type: string
 *                   example: connected
 *                   description: MongoDB connection status (connected/disconnected)
 *                 node_env:
 *                   type: string
 *                   example: development
 *                 uptime:
 *                   type: number
 *                   example: 3600
 *                   description: Server uptime in seconds
 */
router.get("/status", (req, res) => {
  const redisStatus = redisClient.connected ? "connected" : "disconnected";
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  res.json({
    status: "OK",
    redis: redisStatus,
    mongodb: mongoStatus,
    node_env: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
  });
});

/**
 * @swagger
 * /system/performance:
 *   get:
 *     summary: Get system performance metrics
 *     description: Returns performance metrics for Redis and MongoDB including cache hit counts and database stats
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System performance metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 redis:
 *                   type: object
 *                   properties:
 *                     cacheHits:
 *                       type: number
 *                       description: Number of Redis cache hits
 *                       example: 1245
 *                     keysCount:
 *                       type: number
 *                       description: Number of keys in Redis database
 *                       example: 587
 *                     status:
 *                       type: string
 *                       description: Redis connection status
 *                       example: connected
 *                 mongodb:
 *                   type: object
 *                   properties:
 *                     collections:
 *                       type: number
 *                       description: Number of MongoDB collections
 *                       example: 12
 *                     objects:
 *                       type: number
 *                       description: Total number of documents
 *                       example: 8752
 *                     avgObjSize:
 *                       type: number
 *                       description: Average object size in bytes
 *                       example: 1024
 *                     dataSize:
 *                       type: number
 *                       description: Total data size in bytes
 *                       example: 8962048
 *                     indexes:
 *                       type: number
 *                       description: Number of indexes
 *                       example: 35
 *                     indexSize:
 *                       type: number
 *                       description: Size of indexes in bytes
 *                       example: 1048576
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to get performance data
 */
router.get("/performance", async (req, res) => {
  try {
    let redisCacheHits = 0;
    try {
      const redisInfo = await infoAsync();
      const keyspace = redisInfo
        .split("\n")
        .find((line) => line.startsWith("# Keyspace"));
      redisCacheHits = keyspace ? parseInt(keyspace.split(":")[1] || 0) : 0;
    } catch (err) {
      console.error("Error getting Redis info:", err);
    }

    const mongoStats = await mongoose.connection.db.stats();

    res.json({
      redis: {
        cacheHits: redisCacheHits,
        keysCount: await dbsizeAsync().catch(() => 0),
        status: redisClient.connected ? "connected" : "disconnected",
      },
      mongodb: {
        collections: mongoStats.collections,
        objects: mongoStats.objects,
        avgObjSize: mongoStats.avgObjSize,
        dataSize: mongoStats.dataSize,
        indexes: mongoStats.indexes,
        indexSize: mongoStats.indexSize,
      },
    });
  } catch (error) {
    console.error("Error in performance endpoint:", error);
    res.status(500).json({ error: "Failed to get performance data" });
  }
});

/**
 * @swagger
 * /system/flush-cache:
 *   post:
 *     summary: Flush Redis cache
 *     description: Clears all Redis cache data. Only available in development mode.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Cache flush successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Redis cache flushed successfully
 *       500:
 *         description: Cache flush failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to flush cache
 */
// Only available in development mode
if (process.env.NODE_ENV === "development") {
  router.post("/flush-cache", async (req, res) => {
    try {
      await flushallAsync();
      console.log("Redis cache flushed successfully");
      res.json({ success: true, message: "Redis cache flushed successfully" });
    } catch (error) {
      console.error("Error flushing Redis cache:", error);
      res.status(500).json({
        success: false,
        message: "Failed to flush cache",
        error: error.message,
      });
    }
  });
}

module.exports = router;
