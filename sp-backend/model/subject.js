const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject_name: { type: String, unique: true },
  units: { type: Number, default: null },
  activities: [{ type: String, unique: true }]
});

module.exports = mongoose.model("subject", subjectSchema);