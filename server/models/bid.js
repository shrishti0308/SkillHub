/**
 * @swagger
 * components:
 *   schemas:
 *     Bid:
 *       type: object
 *       required:
 *         - amount
 *         - job
 *         - freelancer
 *       properties:
 *         amount:
 *           type: number
 *           description: The bid amount proposed by the freelancer
 *         job:
 *           type: string
 *           format: objectId
 *           description: Reference to the job being bid on
 *         freelancer:
 *           type: string
 *           format: objectId
 *           description: Reference to the user making the bid
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *           default: pending
 *           description: Current status of the bid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", bidSchema);
