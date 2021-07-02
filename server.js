const express = require("express");
const { model } = require("mongoose");
const cors = require("cors");
const { store, Thread } = require("./model.js");
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

// Get /thread
// Get - get all
app.get("/thread", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  console.log(`return Threads`);
  Thread.find({}, function (err, todos) {
    if (err) {
      console.log(`there was an error fetching the threads.`);
      res.status(500).json({ message: `unable to get threads`, error: err });
      return;
    }

    res.status(200).json(todos);
  });
});

// Get /thread/id
app.get("/thread/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`Getting id:${req.params.id}`);
  Thread.findById(req.params.id, (err, todo) => {
    // check if there was an error
    if (err) {
      console.log(`unable to find todo with id ${req.params.id}`, err);
      res.status(500).send(
        JSON.stringify({
          message: `unable to find todo with id ${req.params.id}`,
          error: err,
        })
      );
      return;
    } else if (todo === null) {
      res.status(404).json({ message: `unable to find todo`, error: err });
      return;
    }

    // res.status(200).send(JSON.stringify(todo))
    res.status(200).json(todo); //both lines of res.status work the same
  });
});

// Post /thread
app.post("/thread/", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(`creating a thread with a body ${req.body}`);
  if (
    !req.body.name ||
    !req.body.description ||
    !req.body.description ||
    !req.body.category
  ) {
    console.log(`unable to create thread because one field was empty.`);
    res.status(400).json({
      message: "unable to create thread",
      error: "One field was empty",
    });
    return;
  }

  Thread.create(
    {
      name: req.body.name,
      description: req.body.description,
      author: req.body.author,
      category: req.body.category,
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

// Delete /thread/id

// POST /post

// DELETE /post/thread_id/post_id

module.exports = app;
