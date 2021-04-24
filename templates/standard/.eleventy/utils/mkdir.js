const fs = require('fs');

/**
 * Recursively creates directories if they are not
 * exists.
 * @param {string} directoryPath
 * @returns {Promise<void>}
 */
module.exports = async (directoryPath) =>
  void (
    fs.existsSync(directoryPath) ||
    (await fs.promises.mkdir(directoryPath, { recursive: true }))
  );
