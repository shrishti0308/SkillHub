const { expect } = require("chai");
const axios = require("axios");

describe("GET /jobs/marketplace", () => {
  const API_URL = "http://localhost:3000/jobs/marketplace";

  it("should return the response structure and content type", async function () {
    try {
      const response = await axios.get(API_URL);

      console.log("Response status:", response.status);
      console.log("Content-Type:", response.headers["content-type"]);
      console.log("Response body type:", typeof response.data);
      console.log("Is array?", Array.isArray(response.data));

      if (Array.isArray(response.data)) {
        console.log("Array length:", response.data.length);
        if (response.data.length > 0) {
          console.log("First item:", JSON.stringify(response.data[0], null, 2));
        }
      } else {
        console.log("Response data:", JSON.stringify(response.data, null, 2));
      }

      // Basic assertions
      expect(response.status).to.equal(200);
      expect(response.headers["content-type"]).to.include("application/json");

      // The key assertion we need: data should be an array
      expect(Array.isArray(response.data)).to.be.true;
    } catch (error) {
      console.error("Error making request:", error.message);
      if (error.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", error.response.data);
      }
      throw error;
    }
  });
});
