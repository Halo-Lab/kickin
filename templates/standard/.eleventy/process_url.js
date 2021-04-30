const path = require('path');

const optimizeImage = require('./utils/image');
const { isImage, isFont } = require('./utils/formats');
const { IMAGES_DIRECTORY, FONTS_DIRECTORY } = require('./constants');

/** Rebases urls in styles and make image optimizations. */
const rebase = (url) => {
  if (isImage(url)) {
    optimizeImage(url);
  }

  return path.join(
    '/',
    isImage(url) ? IMAGES_DIRECTORY : isFont(url) ? FONTS_DIRECTORY : '',
    url
  );
};

/**
 * Rebases relative urls in styles.
 * If url is already absolute, then it is
 * returned as is. We do not do any optimizations
 * in this case.
 */
module.exports.processUrl = ({ url }) =>
  path.isAbsolute(url) ? url : rebase(url);
