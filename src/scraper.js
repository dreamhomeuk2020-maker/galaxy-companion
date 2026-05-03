const axios = require("axios");
const cheerio = require("cheerio");

const RESOURCE_URL = "https://galaxyharvester.net/resource.py/151/";
const SCHEMATIC_URL = "https://galaxyharvester.net/schematics.py/index";

async function getInventoryFromDrive() {
  const res = await axios.get(process.env.DRIVE_URL);
  return res.data.split("\n").map(x => x.trim()).filter(Boolean);
}

async function getResources() {
  const { data } = await axios.get(RESOURCE_URL, { timeout: 10000 });
  const $ = cheerio.load(data);

  const out = new Set();
  $("td, tr").each((_, el) => {
    const t = $(el).text().trim();
    if (t.length > 3 && t.length < 60) out.add(t);
  });

  return [...out];
}

async function getSchematics() {
  const { data } = await axios.get(SCHEMATIC_URL, { timeout: 10000 });
  const $ = cheerio.load(data);

  const list = [];

  $("tr, .schematic").each((_, el) => {
    const name = $(el).find("td:first-child, .title").text().trim();
    const best = [];

    $(el).find("td, .resource").each((_, r) => {
      const v = $(r).text().trim();
      if (v && v.length < 50) best.push(v);
    });

    if (name && best.length) {
      list.push({ name, best });
    }
  });

  return list;
}

async function getGalaxyData() {
  const [resources, schematics] = await Promise.all([
    getResources(),
    getSchematics()
  ]);

  return { resources, schematics };
}

module.exports = {
  getInventoryFromDrive,
  getResources,
  getSchematics,
  getGalaxyData
};
