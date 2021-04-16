import { resolve } from 'path';

import chalk from 'chalk';

import { mkdir } from './mkdir';
import { copyTemplate } from './template';
import { asyncSequence } from './async_sequence';
import { createPackageJson } from './package_json';

export const createProject = async (folder = process.cwd()): Promise<void> =>
  asyncSequence(
    mkdir,
    createPackageJson,
    copyTemplate
  )(resolve(folder)).then(() => {
    if (folder !== process.cwd()) {
      console.log();
      console.log(`Now navigate to ${chalk.green(folder)}.`);
      console.log(`  - ${chalk.magenta(`cd ${folder}`)}`);
      console.log();
      console.log('And then 👇');
    }

    console.log();
    console.log('To start development server use:');
    console.log(`  - ${chalk.magenta('npm start')} command.`);
    console.log();
    console.log('To build project:');
    console.log(`  - ${chalk.magenta('npm run build')} command.`);
    console.log();
    console.log(`${chalk.bold.blue('Done!')} Happy coding :)`);
  });
