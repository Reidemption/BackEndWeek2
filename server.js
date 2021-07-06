const express = require("express");
const { model } = require("mongoose");
const cors = require("cors");
const { Thread } = require("./model.js");
const app = express();
app.use(cors());
app.use(express.json({}));

app.use((req, res, next) => {
  console.log(
    "Time",
    Date.now(),
    " - Method: ",
    req.method,
    " - Path: ",
    req.originalUrl,
    " - Body: ",
    req.body
  );
  next();
});

// The /: means that the following a a parameter. Could be anything that gets passed in.

// Get /thread
app.get("/thread", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`return all Threads`);
  Thread.find({}, (err, threads) => {
    if (err != null) {
      res.status(500).json({
        err: error,
        message: "wasnt able to list all threads",
      });
      return;
    }
    res.status(200).json(threads);
  });
});

// Get /thread/:id
app.get("/thread/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`Getting specific thread with id:${req.params.id}`);
  Thread.findById(req.params.id, (err, threads) => {
    if (err != null) {
      res.status(500).json({
        err: error,
        message: "Unable to find thread with that id",
      });
      return;
    } else if (threads === null) {
      res.status(404).json({ message: `unable to find threads`, error: err });
      return;
    }
    res.status(200).json(threads);
  });
});

// Post /thread
app.post("/thread", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(`creating a thread with a body ${req.body}`);
  if (
    !req.body.name ||
    !req.body.description ||
    !req.body.category ||
    !req.body.author
  ) {
    console.log(`unable to create thread because fields are missing`);
    res.status(400).json({
      message: "unable to create thread",
      error: "field is missing",
    });
    return;
  }
  Thread.create(
    {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      author: req.body.author,
    },
    (err, thread) => {
      if (err) {
        console.log(`unable to create thread`);
        res.status(400).json({
          message: "unable to create thread",
          error: err,
        });
        return;
      }
      res.status(201).json(thread);
    }
  );
});

// Delete /thread/:id
app.delete("/thread/:id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(`Deleting thread with id: ${req.params.id}`, req.body);
  Thread.findByIdAndDelete(req.body.thread_id, (err, thread) => {
    if (err != null) {
      res.status(500).json({
        err: error,
        message: "Unable to find thread with that id",
      });
      return;
    } else if (thread === null) {
      res
        .status(404)
        .json({ message: `unable to find thread to delete`, error: err });
      return;
    }
    res.status(200).json(thread);
  });
});

// POST /post
app.post("/post", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(`creating a post with a body ${req.body}`);

  let newPost = {
    author: req.body.author,
    body: req.body.body,
    thread_id: req.body.thread_id,
  };

  Thread.findByIdAndUpdate(
    req.body.thread_id,
    { $push: { posts: newPost } },
    { new: true },
    (err, thread) => {
      if (err != null) {
        res.status(500).json({
          err: error,
          message: "Unable to find thread with that id",
        });
        return;
      } else if (thread === null) {
        res
          .status(404)
          .json({ message: `unable to find thread to delete`, error: err });
        return;
      }
      res.status(200).json(thread.posts[thread.posts.length - 1]);
    }
  );
});

// DELETE /post/:thread_id/:post_id
app.delete("/post/:thread_id/:post_id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(
    `Deleting a post with thread id: ${req.params.thread_id} and post id: ${req.params.post_id}`,
    req.body
  );
  Thread.findByIdAndUpdate(
    req.params.thread_id,
    {
      $pull: {
        posts: {
          _id: req.params.post_id,
        },
      },
    },
    (err, thread) => {
      if (err != null) {
        res.status(500).json({
          err: error,
          message: "Unable to find post with that id",
        });
        return;
      } else if (thread === null) {
        res
          .status(404)
          .json({ message: `unable to find post to delete`, error: err });
        return;
      }
      let post;
      thread.posts.forEach((e) => {
        if (e._id == req.params.post_id) {
          post = e;
        }
      });
      if (post == undefined) {
        res.status(404).json({
          error: err,
          message: "could not find post",
        });
        return;
      }

      res.status(200).json(post);
    }
  );
});

module.exports = app;
