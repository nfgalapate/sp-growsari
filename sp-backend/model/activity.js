const mongoose = require("mongoose");
const Subject = require("./subject");
const ACTIVITYSTATUS = ["New", "Completed"];
const activitySchema = new mongoose.Schema({
  activity_name: { type: String, default: null, unique: true },
  subject: { type: String, default: null },
  student: { type: String },
  status: { type: String, enum: ACTIVITYSTATUS, default: "New"}
  
});


module.exports = mongoose.model("activity", activitySchema);