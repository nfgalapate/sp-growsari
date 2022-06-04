const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
  subjects: [
    {
    subject_id: {type: String},
    status: {type: String}
    }
  ],
  activities: [
    {
      activity_id: {type: String},
      status: {type: String}
    }
  ],
  notes: [{type: String}]
});

module.exports = mongoose.model("user", userSchema);