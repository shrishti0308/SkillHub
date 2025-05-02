/**
 * SkillHub Performance Testing Script
 *
 * This script tests the performance improvement from:
 * 1. Database indexing
 * 2. Redis caching
 *
 * It runs various API endpoints both with and without caching enabled,
 * and compares the response times.
 */

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE_URL = "http://localhost:3000";
const TEST_ITERATIONS = 100; // Number of requests to make for each endpoint
const TEST_ENDPOINTS = [
  "/jobs/marketplace",
  "/user/profiles",
  "/bids/recent",
  // Add more endpoints as needed
];

// Auth token for protected routes (replace with valid token)
const AUTH_TOKEN = "your_auth_token";

/**
 * Run a performance test against an endpoint
 * @param {string} endpoint - API endpoint to test
 * @param {boolean} withCaching - Whether caching is enabled
 * @returns {Promise<Object>} - Results including average response time
 */
async function runEndpointTest(endpoint, withCaching = false) {
  const results = {
    endpoint,
    withCaching,
    responseTimes: [],
    avgResponseTime: 0,
    minResponseTime: Number.MAX_SAFE_INTEGER,
    maxResponseTime: 0,
    successRate: 0,
  };

  const headers = {
    Authorization: AUTH_TOKEN ? `Bearer ${AUTH_TOKEN}` : undefined,
    "Cache-Control": withCaching ? undefined : "no-cache",
  };

  let successCount = 0;

  for (let i = 0; i < TEST_ITERATIONS; i++) {
    try {
      const startTime = process.hrtime();

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers,
      });

      const endTime = process.hrtime(startTime);
      const responseTimeMs = endTime[0] * 1000 + endTime[1] / 1000000;

      results.responseTimes.push(responseTimeMs);
      results.minResponseTime = Math.min(
        results.minResponseTime,
        responseTimeMs
      );
      results.maxResponseTime = Math.max(
        results.maxResponseTime,
        responseTimeMs
      );

      if (response.status === 200) {
        successCount++;
      }

      // Add a small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`Error on ${endpoint}: ${error.message}`);
    }
  }

  results.successRate = (successCount / TEST_ITERATIONS) * 100;

  // Calculate average response time
  if (results.responseTimes.length > 0) {
    results.avgResponseTime =
      results.responseTimes.reduce((sum, time) => sum + time, 0) /
      results.responseTimes.length;
  }

  return results;
}

/**
 * Run tests on all endpoints
 */
async function runAllTests() {
  const allResults = {
    timestamp: new Date().toISOString(),
    endpoints: [],
  };

  // First flush Redis cache to ensure clean testing
  try {
    await axios.post(`${API_BASE_URL}/system/flush-cache`);
    console.log("Redis cache flushed successfully");
  } catch (error) {
    console.error("Failed to flush Redis cache:", error.message);
  }

  // Run tests for each endpoint without caching
  console.log("\n🔄 Running tests WITHOUT caching...");
  for (const endpoint of TEST_ENDPOINTS) {
    console.log(`Testing ${endpoint}...`);
    const result = await runEndpointTest(endpoint, false);
    allResults.endpoints.push(result);
    console.log(`✅ Avg response time: ${result.avgResponseTime.toFixed(2)}ms`);
  }

  // Short pause
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Run tests for each endpoint with caching
  console.log("\n🔄 Running tests WITH caching...");
  for (const endpoint of TEST_ENDPOINTS) {
    console.log(`Testing ${endpoint}...`);

    // First request to prime the cache
    await axios.get(`${API_BASE_URL}${endpoint}`);
    console.log("Cache primed");

    // Actual test
    const result = await runEndpointTest(endpoint, true);
    allResults.endpoints.push(result);
    console.log(`✅ Avg response time: ${result.avgResponseTime.toFixed(2)}ms`);
  }

  // Process results
  processResults(allResults);
}

/**
 * Process and save test results
 * @param {Object} allResults - All test results
 */
function processResults(allResults) {
  // Calculate improvements
  const improvements = [];

  for (let i = 0; i < TEST_ENDPOINTS.length; i++) {
    const endpoint = TEST_ENDPOINTS[i];
    const withoutCaching = allResults.endpoints.find(
      (r) => r.endpoint === endpoint && !r.withCaching
    );
    const withCaching = allResults.endpoints.find(
      (r) => r.endpoint === endpoint && r.withCaching
    );

    if (withoutCaching && withCaching) {
      const improvement = {
        endpoint,
        withoutCachingAvg: withoutCaching.avgResponseTime,
        withCachingAvg: withCaching.avgResponseTime,
        improvementMs:
          withoutCaching.avgResponseTime - withCaching.avgResponseTime,
        improvementPercent:
          ((withoutCaching.avgResponseTime - withCaching.avgResponseTime) /
            withoutCaching.avgResponseTime) *
          100,
      };

      improvements.push(improvement);
    }
  }

  // Generate report
  const report = {
    timestamp: allResults.timestamp,
    improvements,
    rawResults: allResults,
  };

  // Save report to file
  const reportJson = JSON.stringify(report, null, 2);
  const reportPath = path.join(__dirname, "../log/performance-report.json");

  fs.writeFileSync(reportPath, reportJson);

  // Print summary
  console.log("\n📊 PERFORMANCE IMPROVEMENT SUMMARY");
  console.log("==============================");

  for (const imp of improvements) {
    console.log(`\n${imp.endpoint}`);
    console.log(`Without caching: ${imp.withoutCachingAvg.toFixed(2)}ms`);
    console.log(`With caching: ${imp.withCachingAvg.toFixed(2)}ms`);
    console.log(
      `Improvement: ${imp.improvementMs.toFixed(
        2
      )}ms (${imp.improvementPercent.toFixed(2)}%)`
    );
  }

  console.log(`\n✅ Full report saved to: ${reportPath}`);
}

// Run the tests
runAllTests().catch(console.error);
