let cache = null;
let last = 0;

function getCache() {
  return cache;
}

function setCache(data) {
  cache = data;
  last = Date.now();
}

function isValid(ttl = 300000) {
  return cache && Date.now() - last < ttl;
}

module.exports = { getCache, setCache, isValid };
