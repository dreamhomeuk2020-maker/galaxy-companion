const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { getRecommendations } = require("./src/engine");
const { authMiddleware } = require("./src/middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

// DB
mongoose.connect(process.env.MONGO_URI);

// 🧠 SaaS endpoint
app.get("/api/dashboard", authMiddleware, async (req, res) => {
  const data = await getRecommendations(req.user.id);
  res.json(data);
});

app.listen(process.env.PORT || 3000);
