const { getGalaxyData } = require("./src/scraper");
const Cache = require("./src/models/Cache");

async function run() {
  const data = await getGalaxyData();

  await Cache.findOneAndUpdate(
    {},
    { ...data, updatedAt: new Date() },
    { upsert: true }
  );

  console.log("Cache updated");
}

setInterval(run, 600000);
run();
