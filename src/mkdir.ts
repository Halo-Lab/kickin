import { existsSync, promises } from 'fs';

/** Recursively creates directories and returns the path of desctination directory. */
export const mkdir = async (url: string): Promise<void> =>
  void (!existsSync(url) && (await promises.mkdir(url, { recursive: true })));
