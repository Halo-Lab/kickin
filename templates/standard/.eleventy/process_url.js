const path = require('path');

const { isImage, isFont } = require('./utils/formats');
const { IMAGES_DIRECTORY, FONTS_DIRECTORY } = require('./constants');

/** Rebases urls in styles. */
module.exports.processUrl = (url) => {
	if (isImage(url)) {
		optimizeImage(url);

		return '/' + path.join(IMAGES_DIRECTORY, url);
	} else if (isFont(url)) {
		return '/' + path.join(FONTS_DIRECTORY, url);
	} else {
		return url;
	}
};
