const mongoose = require("mongoose");

const audioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
    unique: true,
  },
  isprivate: {
    type: Boolean,
    required: true,
  },
  coverImage: {
    type: String,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'   
  }
});

module.exports = mongoose.model("Audio", audioSchema);
