import { rmdirSync, existsSync } from 'fs';
import IOptions from '../IOptions';

function removeDir(
  entryPath: string,
  result: string[],
  options: IOptions
): void {
  if (existsSync(entryPath)) {
    if (!options.dry) {
      rmdirSync(entryPath, { recursive: true });
    }
    result.push(entryPath);
  }
}

export default removeDir;
