import { promises } from 'fs';
import { resolve, join } from 'path';

import ora from 'ora';

import { mkdir } from './mkdir';

const TEMPLATES_DIRECTORY = resolve(__dirname, '..', 'templates');

/**
 * Recursively copy files from _input_ directory
 * to _to_ directory.
 */
const copyDirectory = async (
	input: string,
	to: string
): Promise<ReadonlyArray<any>> =>
	promises
		.readdir(input, { withFileTypes: true })
		.then((entities) =>
			// In case of empty directory, we should return immediately
			// resolved promise for `Promise.all` method.
			entities.length === 0
				? [Promise.resolve()]
				: entities.map((entity) =>
						entity.isDirectory()
							? mkdir(join(to, entity.name)).then(() =>
									copyDirectory(join(input, entity.name), join(to, entity.name))
							  )
							: promises.copyFile(
									join(input, entity.name),
									join(to, entity.name)
							  )
				  )
		)
		.then(Promise.all.bind(Promise));

export const copyTemplate = async (cwd: string): Promise<void> => {
	// In future we may use more than one template.
	const templateName = 'standard';

	const spinner = ora('Copying template files.').start();

	await copyDirectory(join(TEMPLATES_DIRECTORY, templateName), cwd).then(
		() => spinner.succeed("Project's structure is generated."),
		(error) => spinner.fail(error)
	);
};
