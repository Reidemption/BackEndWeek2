const store = {};
const mongoose = require("mongoose");
const threadSchema = new mongoose.Schema({
  name: String,
  description: String,
  author: String,
  category: String,
});

const Thread = mongoose.model("Thread", todoSchema);

module.exports = {
  Thread,
  store,
};
