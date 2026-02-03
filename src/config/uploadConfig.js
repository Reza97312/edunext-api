const path = require("path");
const fs = require("fs");

const UPLOADS_DIR = path.resolve(__dirname, "..", "..", "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

module.exports = {
  UPLOADS_DIR,
};
