const { getInventory } = require("./scraper");
const { getResources, getSchematics } = require("./scraper");

function score(s, inv) {
  return s.best.filter(r => !inv.includes(r)).length * 10;
}

async function getRecommendations() {
  const inv = await getInventory();
  const resources = await getResources();
  const schematics = await getSchematics();

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

module.exports = { getRecommendations };
