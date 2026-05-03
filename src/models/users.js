const mongoose = require("mongoose");

module.exports = mongoose.model("User", {
  email: String,
  passwordHash: String,
  inventory: [String]
});
