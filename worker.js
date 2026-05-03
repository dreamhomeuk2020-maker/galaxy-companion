const { scrapeGalaxy } = require("./src/scraper");
const Cache = require("./models/Cache");

async function run() {
  const data = await scrapeGalaxy();

  await Cache.findOneAndUpdate(
    {},
    { ...data, updatedAt: new Date() },
    { upsert: true }
  );

  console.log("Galaxy data updated");
}

// every 10 minutes
setInterval(run, 600000);

run();
