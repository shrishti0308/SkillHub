const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "sub-admin"],
      default: "sub-admin",
    },
    permissions: [String], // e.g., ['manageUsers', 'viewTransactions']
    wallet: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
