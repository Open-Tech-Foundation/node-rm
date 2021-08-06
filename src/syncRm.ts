import { statSync, unlinkSync, rmdirSync } from 'fs';
import Path from 'path';
import { style } from '@open-tech-world/es-cli-styles';
import { globSync } from '@open-tech-world/node-glob';
import { matchPathGlob } from '@open-tech-world/es-glob';

import IOptions from './IOptions';

function removeDir(
  entry: string,
  ignoreEntries: string[],
  ignorePatterns: string[],
  options: IOptions
) {
  const entryPath = Path.join(options.cwd, entry);
  const skip = ignoreEntries.some((p) => matchPathGlob(entry, p));

  if (skip) {
    console.log(style('~yellow{' + entryPath + '}'));
    const entries = getEntries([entry + '/*', ...ignorePatterns], options);
    removeEntries(entries, ignoreEntries, ignorePatterns, options);
    return;
  }

  rmdirSync(entryPath, { recursive: true });
  console.log(style('~red{' + entryPath + '}'));
}

function removeFile(entryPath: string) {
  unlinkSync(entryPath);
  console.log(style('~red{' + entryPath + '}'));
}

function removeEntries(
  entries: string[],
  ignoreEntries: string[],
  ignorePatterns: string[],
  options: IOptions
): void {
  entries.forEach((entry) => {
    const entryPath = Path.join(options.cwd, entry);

    const stat = statSync(entryPath);

    if (stat.isDirectory()) {
      removeDir(entry, ignoreEntries, ignorePatterns, options);
    }

    if (stat.isFile()) {
      removeFile(entryPath);
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
    removeEntries(entries, ignoreEntries, ignorePatterns, currentOptions);
  } catch (error) {
    console.error(style(`~red.bold{Error:} ~red{${error.message}}`));
  }
}

export default syncRm;
