import { promises } from 'fs';
import { sep, join } from 'path';

import ora from 'ora';
import chalk from 'chalk';

import { execFor } from './exec_for';
import { TOMATO_COLOR } from './colors';
import { asyncSequence } from './async_sequence';
import { checkNpmVersion } from './check_npm_version';

const generatePackageJson = async (cwd: string) => {
  const directories = cwd.split(sep);
  const lastDirectory = directories[directories.length - 1];

  const spinner = ora(
    `Initializing ${chalk.bold.yellow('package.json')}.`
  ).start();

  return promises
    .writeFile(
      join(cwd, 'package.json'),
      JSON.stringify(
        {
          name: lastDirectory,
          version: '0.1.0',
          private: true,
          scripts: {
            clean: 'rimraf build',
            build: 'NODE_ENV=production eleventy build',
            start: 'eleventy --serve --port=3000',
            prestart: 'npm run clean',
            prebuild: 'npm run clean',
          },
          browserslist: ['> 0.5%', 'last 4 version', 'not dead'],
        },
        null,
        2
      ),
      {
        encoding: 'utf-8',
      }
    )
    .then(
      () => spinner.succeed(`${chalk.bold.yellow('package.json')} is created.`),
      (error) => spinner.fail(error)
    );
};

const dependencies = async (cwd: string) => {
  const spinner = ora('Installing dependencies...').start();

  return execFor(cwd)('npm', [
    // Must be at first.
    'i',
    '-D',
    // The rest arguments.
    'svgo',
    'dotenv',
    'rimraf',
    'postcss-url',
    'http-server',
    'html-minifier',
    '@11ty/eleventy',
    '@11ty/eleventy-img',
    'eleventy-plugin-workbox',
    'eleventy-plugin-styles',
    'eleventy-plugin-scripts',
    'eleventy-plugin-compress',
    'eleventy-shortcode-image',
    'eleventy-plugin-pwa-icons',
    '@quasibit/eleventy-plugin-sitemap',
  ]).then(
    () => spinner.succeed('Dependencies are installed.'),
    (error) => spinner.fail(error)
  );
};

/** Installs peer dependencies if npm version is 6 and below. */
const peerDependencies = async (cwd: string) => {
  const { version, needToInstallPeerDependencies } = checkNpmVersion();

  if (needToInstallPeerDependencies) {
    console.log(
      ` - Your version of ${chalk.gray('npm')} is (${chalk.bold.hex(
        TOMATO_COLOR
      )(version)}), so we should handle also peer dependencies.`
    );

    const spinner = ora('Installing peer dependencies...').start();

    return execFor(cwd)('npm', [
      'i',
      '-D',
      'sass',
      'chalk',
      'cssnano',
      'postcss',
      'esbuild',
      'autoprefixer',
      'browserslist',
      'workbox-build',
      'pwa-asset-generator',
      '@fullhuman/postcss-purgecss',
    ]).then(
      () => spinner.succeed('Peer dependencies are installed.'),
      (error) => spinner.fail(error)
    );
  }
};

export const createPackageJson = asyncSequence(
  generatePackageJson,
  dependencies,
  peerDependencies
);
