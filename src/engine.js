const { getInventory, getGalaxyData } = require("./scraper");
const User = require("./models/User");

function score(s, inv) {
  return s.best.filter(r => !inv.includes(r)).length * 10;
}

async function getRecommendations(userId) {
  const user = await User.findById(userId);

  const { resources, schematics } = await getGalaxyData();

  return schematics
    .map(s => ({
      name: s.name,
      missing: s.best.filter(r => !user.inventory.includes(r)),
      score: score(s, user.inventory)
    }))
    .sort((a, b) => b.score - a.score);
}

module.exports = { getRecommendations };
