const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;

const XML_URL = "https://www.galaxyharvester.net/exports/current151.xml";

let cachedJSON = null;
let lastUpdated = null;

async function fetchXML() {
  try {
    const response = await axios.get(XML_URL);
    const xml = response.data;
    const json = await xml2js.parseStringPromise(xml, { mergeAttrs: true });
    cachedJSON = json;
    lastUpdated = new Date();
    console.log(`[${lastUpdated.toISOString()}] XML converted to JSON`);
  } catch (err) {
    console.error("Error fetching/converting XML:", err.message);
  }
}

// Initial fetch
fetchXML();

// Refresh every 15 minutes
cron.schedule("*/15 * * * *", fetchXML);

// Serve JSON publicly
app.get("/current151.json", (req, res) => {
  if (!cachedJSON) return res.status(503).json({ error: "Data not ready" });
  res.json({ lastUpdated, data: cachedJSON });
});

app.listen(PORT, () => console.log(`JSON service running on port ${PORT}`));
