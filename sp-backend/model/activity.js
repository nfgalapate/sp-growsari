const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  subject: { type: String, default: null },
  activity_name: { type: String, default: null },
  total_points: { type: Number, default: null },
  score: { type: Number, default: null },
  status: { type: String, unique: false }
});

module.exports = mongoose.model("activity", activitySchema);