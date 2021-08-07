import { style } from '@open-tech-world/es-cli-styles';

import IOptions from '../IOptions';
import getEntries from './getEntries';
import removeEntries from './removeEntries';

function rmSync(patterns: string | string[], options?: IOptions): void {
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

export default rmSync;
