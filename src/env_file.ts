import { join } from 'path';
import { promises } from 'fs';

export const generateEnvFile = (cwd: string) =>
  promises.writeFile(join(cwd, '.env'), 'HOST=http://localhost:3000', {
    encoding: 'utf-8',
  });
