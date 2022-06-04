const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  note_title: { type: String, default: null, unique: true },
  author: {type: String, default: null},
  content: { type: String, default: null },
  date: [{ type: Date }]
});

module.exports = mongoose.model("note", noteSchema);