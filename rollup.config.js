import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'src/index.ts',
	output: {
		dir: 'build',
		format: 'cjs',
		preserveModules: true,
		preserveModulesRoot: 'src',
	},
	plugins: [typescript(), json(), terser()],
	external: [
		'fs',
		'ora',
		'util',
		'path',
		'https',
		'chalk',
		'commander',
		'child_process',
	],
};
