import { globSync } from '@open-tech-world/node-glob';
import IOptions from '../IOptions';

function getEntries(patterns: string | string[], options: IOptions): string[] {
  const entries = globSync(patterns, {
    cwd: options.cwd,
    dot: options.dot,
  });

  return entries;
}

export default getEntries;
