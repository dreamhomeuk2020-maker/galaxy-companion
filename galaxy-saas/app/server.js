const express = require("express");
const { getGalaxyData } = require("./scraper");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/recommendations", async (req, res) => {
  const galaxyData = await getGalaxyData();
  const recommendations = calculateRecommendations(req.user, galaxyData);
  res.json(recommendations);
});

app.use(express.static("public"));

app.listen(PORT, () => console.log(`SaaS app running on port ${PORT}`));
