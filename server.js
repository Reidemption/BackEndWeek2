const express = require("express");
const { model } = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json({}));

module.exports = app;
