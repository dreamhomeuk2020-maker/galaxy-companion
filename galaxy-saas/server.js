require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { getRecommendations } = require("./src/engine");
const authMiddleware = require("./src/middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI);

// 🔐 Protected dashboard API
app.get("/api/dashboard", authMiddleware, async (req, res) => {
  const data = await getRecommendations(req.user.id);
  res.json(data);
});

app.listen(process.env.PORT || 3000, () =>
  console.log("API running")
);
