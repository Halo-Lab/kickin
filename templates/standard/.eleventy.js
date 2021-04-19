// Setup dotenv package and load environment variables from .env file.
require('dotenv').config();

const path = require('path');

const url = require('postcss-url');
const htmlmin = require('html-minifier');
const sitemap = require('@quasibit/eleventy-plugin-sitemap');
const { cache } = require('eleventy-plugin-workbox');
const { icons } = require('eleventy-plugin-pwa-icons');
const { styles } = require('eleventy-plugin-styles');
const { scripts } = require('eleventy-plugin-scripts');
const { compress } = require('eleventy-plugin-compress');
const { createImageShortcode } = require('eleventy-shortcode-image');

const { processUrl } = require('./.eleventy/process_url');
const {
  FAVICON_FILE,
  MANIFEST_FILE,
  DATA_DIRECTORY,
  FONTS_DIRECTORY,
  AUDIO_DIRECTORY,
  VIDEO_DIRECTORY,
  BUILD_DIRECTORY,
  ASSETS_DIRECTORY,
  IMAGES_DIRECTORY,
  SOURCE_DIRECTORY,
  LAYOUTS_DIRECTORY,
  FAVICONS_DIRECTORY,
  COMPONENTS_DIRECTORY,
} = require('./.eleventy/constants');

module.exports = (config) => {
  config.addShortcode(
    'image',
    createImageShortcode({
      inputDirectory: path.join(
        SOURCE_DIRECTORY,
        ASSETS_DIRECTORY,
        IMAGES_DIRECTORY
      ),
      outputDirectory: path.join(BUILD_DIRECTORY, IMAGES_DIRECTORY),
    })
  );

  if (process.env.NODE_ENV === 'production') {
    // Generate sitemap only in production environment.
    // This is done for purpose of faster first start.
    // If you need this in development environment, you
    // are free to modify this condition or remove it at all.
    config.addPlugin(sitemap, {
      sitemap: {
        hostname: process.env.HOST,
      },
    });
  }

  // Add generating service worker based on generated by Eleventy HTML files.
  config.addPlugin(cache, { buildDirectory: BUILD_DIRECTORY });
  config.addPlugin(icons, {
    manifest: {
      pathToManifest: path.join(SOURCE_DIRECTORY, MANIFEST_FILE),
      outputDirectory: BUILD_DIRECTORY,
    },
    icons: {
      pathToRawImage: path.join(
        SOURCE_DIRECTORY,
        ASSETS_DIRECTORY,
        IMAGES_DIRECTORY,
        FAVICON_FILE
      ),
      outputDirectory: path.join(
        BUILD_DIRECTORY,
        IMAGES_DIRECTORY,
        FAVICONS_DIRECTORY
      ),
    },
  });
  config.addPlugin(styles, {
    publicDirectory: 'styles',
    // Optimizes and rebases urls in styles.
    postcssPlugins: [url({ url: processUrl })],
  });
  config.addPlugin(scripts, {
    publicDirectory: 'scripts',
  });

  // Minify HTML.
  config.addTransform('htmlmin', function (content, outputPath) {
    if (outputPath.endsWith('.html')) {
      return htmlmin.minify(content, {
        removeComments: true,
        useShortDoctype: true,
        collapseWhitespace: true,
      });
    }

    return content;
  });

  config.addPlugin(compress);
  // Warning: do not set any transform function after this!!!
  // Because result of transformation will not be compressed.

  config.setWatchThrottleWaitTime(500);

  config.addPassthroughCopy({
    [path.join(
      SOURCE_DIRECTORY,
      ASSETS_DIRECTORY,
      FONTS_DIRECTORY
    )]: FONTS_DIRECTORY,
  });
  config.addPassthroughCopy({
    [path.join(
      SOURCE_DIRECTORY,
      ASSETS_DIRECTORY,
      VIDEO_DIRECTORY
    )]: VIDEO_DIRECTORY,
  });
  config.addPassthroughCopy({
    [path.join(
      SOURCE_DIRECTORY,
      ASSETS_DIRECTORY,
      AUDIO_DIRECTORY
    )]: AUDIO_DIRECTORY,
  });
  config.addPassthroughCopy(path.join(SOURCE_DIRECTORY, 'robots.txt'));

  config.addWatchTarget(path.join(SOURCE_DIRECTORY, ASSETS_DIRECTORY));

  return {
    dir: {
      data: DATA_DIRECTORY,
      input: SOURCE_DIRECTORY,
      output: BUILD_DIRECTORY,
      layouts: LAYOUTS_DIRECTORY,
      includes: COMPONENTS_DIRECTORY,
    },
  };
};
