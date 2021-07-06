const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: String,
    body: String,
    thread_id: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
  },
  { timestamps: true }
);

const threadSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    author: String,
    posts: [postSchema],
    category: String,
  },
  { timestamps: true }
);

const Thread = mongoose.model("Thread", threadSchema);

module.exports = {
  Thread,
};
