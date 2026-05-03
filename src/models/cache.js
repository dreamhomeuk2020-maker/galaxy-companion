const mongoose = require("mongoose");

module.exports = mongoose.model("Cache", {
  resources: Array,
  schematics: Array,
  updatedAt: Date
});
