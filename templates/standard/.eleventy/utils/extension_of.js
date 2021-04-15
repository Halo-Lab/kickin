const path = require('path');

/**
 * Extracts extension name from url.
 * @param {string} url
 */
module.exports.extensionOf = (url) => path.extname(url).slice(1);
