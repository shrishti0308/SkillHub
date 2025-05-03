const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const expect = chai.expect;

// Import the components we need to test or mock
const app = require("../index"); // Assuming your Express app is exported from index.js
const Job = require("../models/job");
const redisConfig = require("../config/redis"); // To mock Redis functions

chai.use(chaiHttp);

describe("GET /jobs/marketplace", () => {
  let redisGetStub;
  let jobFindStub;

  beforeEach(() => {
    // --- Mock Redis ---
    // Stub getAsync to simulate a cache miss
    redisGetStub = sinon.stub(redisConfig, "getAsync");
    redisGetStub.resolves(null); // Simulate cache miss

    // Stub setAsync to prevent actual Redis writes during test
    sinon.stub(redisConfig, "setAsync").resolves("OK");

    // --- Mock Mongoose ---
    // Stub Job.find to return controlled data
    jobFindStub = sinon.stub(Job, "find");
  });

  afterEach(() => {
    // Restore the original functions after each test
    sinon.restore();
  });

  it("should return an array of open jobs when cache misses", async () => {
    // Arrange: Define the mock data Job.find should return
    const mockJobs = [
      { _id: "job1", title: "Job One", status: "open", description: "Desc 1" },
      { _id: "job2", title: "Job Two", status: "open", description: "Desc 2" },
    ];
    jobFindStub.withArgs({ status: "open" }).resolves(mockJobs); // Mock the specific query

    // Act: Make the request to the endpoint
    const res = await chai.request(app).get("/jobs/marketplace");

    // Assert
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array"); // Check if the body is an array
    expect(res.body).to.have.lengthOf(2); // Check the number of jobs
    expect(res.body[0]).to.have.property("title", "Job One");
    expect(res.body[1]).to.have.property("title", "Job Two");

    // Verify mocks were called as expected
    sinon.assert.calledOnce(redisGetStub); // Ensure Redis was checked
    sinon.assert.calledOnce(jobFindStub); // Ensure DB was queried
  });

  it("should return an empty array if no open jobs are found", async () => {
    // Arrange: Mock Job.find to return an empty array
    jobFindStub.withArgs({ status: "open" }).resolves([]);

    // Act
    const res = await chai.request(app).get("/jobs/marketplace");

    // Assert
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
    expect(res.body).to.have.lengthOf(0);

    // Verify mocks
    sinon.assert.calledOnce(redisGetStub);
    sinon.assert.calledOnce(jobFindStub);
  });

  it("should handle database errors gracefully", async () => {
    // Arrange: Mock Job.find to simulate a database error
    const dbError = new Error("Database connection failed");
    jobFindStub.withArgs({ status: "open" }).rejects(dbError);

    // Act
    const res = await chai.request(app).get("/jobs/marketplace");

    // Assert
    expect(res).to.have.status(500);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("error", "Error fetching jobs");

    // Verify mocks
    sinon.assert.calledOnce(redisGetStub);
    sinon.assert.calledOnce(jobFindStub);
  });

  // Add more tests here if needed (e.g., for cache hits, though the current focus is on the non-cached path)
});
