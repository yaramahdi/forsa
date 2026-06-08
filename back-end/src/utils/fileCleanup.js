const fs = require("fs");
const path = require("path");

const SRC_ROOT = path.join(__dirname, "..");

const deleteFiles = async (filePaths = []) => {
  for (const relPath of filePaths) {
    const absPath = path.join(SRC_ROOT, relPath);
    try {
      await fs.promises.unlink(absPath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        console.warn(`[fileCleanup] Failed to delete: ${absPath} — ${err.message}`);
      }
    }
  }
};

module.exports = { deleteFiles };
