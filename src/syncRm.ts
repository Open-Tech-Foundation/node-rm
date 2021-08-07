import { statSync, unlinkSync, rmdirSync, existsSync } from 'fs';
import Path from 'path';
import { style } from '@open-tech-world/es-cli-styles';
import { globSync } from '@open-tech-world/node-glob';

import IOptions from './IOptions';

function removeDir(entryPath: string, result: string[]): void {
  if (existsSync(entryPath)) {
    rmdirSync(entryPath, { recursive: true });
    result.push(entryPath);
  }
}

function removeFile(entryPath: string, result: string[]): void {
  if (existsSync(entryPath)) {
    unlinkSync(entryPath);
    result.push(entryPath);
  }
}

function canRemoveDir(dir: string, ignoreEntries: string[]): boolean {
  const bool = ignoreEntries.some((entry) => entry.startsWith(dir));

  return !bool;
}

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

function getEntries(patterns: string | string[], options: IOptions): string[] {
  const entries = globSync(patterns, {
    cwd: options.cwd,
    dot: options.dot,
  });

  return entries;
}

function syncRm(patterns: string | string[], options?: IOptions): void {
  const result: string[] = [];

  const defaultOptions: IOptions = {
    cwd: process.cwd(),
    dot: false,
  };

  const currentOptions = options
    ? Object.assign(defaultOptions, options)
    : defaultOptions;

  const currentPatterns = typeof patterns === 'string' ? [patterns] : patterns;
  const ignorePatterns = currentPatterns.filter((p) => p[0] === '!');
  try {
    const entries = getEntries(currentPatterns, currentOptions);
    const ignoreEntries = getEntries(
      ignorePatterns.map((p) => p.substring(1)),
      currentOptions
    );
    console.log('ignoreEntries', ignoreEntries);

    removeEntries(
      entries,
      ignoreEntries,
      ignorePatterns,
      currentOptions,
      result
    );
    console.log(result);
  } catch (error) {
    console.error(style(`~red.bold{Error:} ~red{${error.message}}`));
  }
}

export default syncRm;
