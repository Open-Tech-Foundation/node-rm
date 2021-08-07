import Path from 'path';
import { existsSync, statSync } from 'fs';

import IOptions from '../IOptions';
import canRemoveDir from '../canRemoveDir';
import removeDir from './removeDir';
import getEntries from './getEntries';
import removeFile from './removeFile';

function removeEntries(
  entries: string[],
  ignoreEntries: string[],
  ignorePatterns: string[],
  options: IOptions,
  result: string[]
): void {
  entries.forEach((entry) => {
    const entryPath = Path.join(options.cwd, entry);

    if (!existsSync(entryPath)) {
      return;
    }

    if (result.includes(Path.dirname(entryPath))) {
      result.push(entryPath);
      return;
    }

    const stat = statSync(entryPath);

    if (stat.isDirectory()) {
      if (canRemoveDir(entry, ignoreEntries)) {
        removeDir(entryPath, result);
        return;
      } else {
        console.log('Skip: ', entryPath);
        const dirEntries = getEntries(
          [`${entry}/*`, ...ignorePatterns],
          options
        );
        removeEntries(
          dirEntries,
          ignoreEntries,
          ignorePatterns,
          options,
          result
        );
      }
    }

    if (stat.isFile()) {
      removeFile(entryPath, result);
    }
  });
}

export default removeEntries;
