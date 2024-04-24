const mongoose = require("mongoose");

const launchesSchema = mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
    // min: 0,
    // max: 10000,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
  },
  customers: [String],
  upcoming: {
    required: true,
    type: Boolean,
    default: true,
  },
  success: {
    required: true,
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("launch", launchesSchema);
