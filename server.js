const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// 🔗 Your sources
const RESOURCE_URL = "https://galaxyharvester.net/resource.py/151/";
const SCHEMATIC_URL = "https://galaxyharvester.net/schematics.py/index";
const DRIVE_URL = "https://drive.google.com/uc?export=download&id=1ZjV9aNoEm_NmzX_uGYk6yXXXCbEY66yY";


// 📥 Fetch inventory from Google Drive
async function getInventory() {
  const res = await axios.get(DRIVE_URL);
  return res.data
    .split("\n")
    .map(r => r.trim())
    .filter(Boolean);
}


// 🪐 Scrape current resources
async function getResources() {
  const { data } = await axios.get(RESOURCE_URL);
  const $ = cheerio.load(data);

  let resources = [];

  $("table tr").each((i, el) => {
    const name = $(el).find("td").eq(0).text().trim();
    if (name) resources.push(name);
  });

  return resources;
}


// 📜 Scrape schematics + best resources
async function getSchematics() {
  const { data } = await axios.get(SCHEMATIC_URL);
  const $ = cheerio.load(data);

  let schematics = [];

  $(".schematic").each((i, el) => {
    const name = $(el).find(".title").text().trim();

    let bestResources = [];
    $(el).find(".best-resource").each((i, r) => {
      bestResources.push($(r).text().trim());
    });

    if (name && bestResources.length) {
      schematics.push({ name, bestResources });
    }
  });

  return schematics;
}


// 🧮 Compare everything
async function analyze() {
  const [inventory, resources, schematics] = await Promise.all([
    getInventory(),
    getResources(),
    getSchematics()
  ]);

  let results = [];

  schematics.forEach(schematic => {
    const missing = schematic.bestResources.filter(r =>
      resources.includes(r) && !inventory.includes(r)
    );

    if (missing.length) {
      results.push({
        schematic: schematic.name,
        missing
      });
    }
  });

  return results;
}


// 🌐 API endpoint
app.get("/api/missing", async (req, res) => {
  try {
    const data = await analyze();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
