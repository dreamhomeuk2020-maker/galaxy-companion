const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// MOCK / CONFIG
const DRIVE_URL = "https://drive.google.com/uc?export=download&id=1ZjV9aNoEm_NmzX_uGYk6yXXXCbEY66yY";

// cache
let cache = null;
let last = 0;

// inventory from Google Drive
async function getInventory() {
  const res = await axios.get(DRIVE_URL);
  return res.data.split("\n").map(x => x.trim()).filter(Boolean);
}

// fake resource scraper (replace if needed)
async function getResources() {
  return [
    "Polysteel Copper",
    "Byrothsis Gemstone",
    "High Grade Polymer",
    "Quadranium Steel"
  ];
}

// fake schematics (safe fallback so app ALWAYS works)
async function getSchematics() {
  return [
    {
      name: "Advanced Weapon Frame",
      best: ["Polysteel Copper", "Quadranium Steel"]
    },
    {
      name: "Armor Core",
      best: ["Byrothsis Gemstone", "High Grade Polymer"]
    }
  ];
}

// scoring engine
function score(s, inv) {
  let score = 0;
  s.best.forEach(r => {
    if (!inv.includes(r)) score += 10;
  });
  return score;
}

async function analyze() {
  const [inv, resources, schematics] = await Promise.all([
    getInventory(),
    getResources(),
    getSchematics()
  ]);

  return schematics
    .map(s => {
      const missing = s.best.filter(r => !inv.includes(r));
      return {
        name: s.name,
        missing,
        score: score(s, inv)
      };
    })
    .sort((a, b) => b.score - a.score);
}

// API
app.get("/api/recommendations", async (req, res) => {
  const now = Date.now();

  if (cache && now - last < 300000) {
    return res.json(cache);
  }

  const data = await analyze();
  cache = data;
  last = now;

  res.json(data);
});

// serve app
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => console.log("Running on " + PORT));
