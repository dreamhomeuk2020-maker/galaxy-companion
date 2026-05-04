const axios = require("axios");

// Cloud JSON URL (after deployment)
const GALAXY_JSON_URL = process.env.GALAXY_JSON_URL || "https://json-service.onrender.com/current151.json";

async function getGalaxyData() {
  try {
    const response = await axios.get(GALAXY_JSON_URL);
    const data = response.data.data;
    return {
      resources: data.resources || [],
      schematics: data.schematics || [],
    };
  } catch (err) {
    console.error("Error fetching Galaxy JSON:", err.message);
    return { resources: [], schematics: [] };
  }
}

module.exports = { getGalaxyData };
