const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject_name: { type: String, default: null },
  units: { type: Number, default: null },
  activities: [{ type: String }]
});

module.exports = mongoose.model("subject", subjectSchema);