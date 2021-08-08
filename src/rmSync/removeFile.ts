import { unlinkSync, existsSync } from 'fs';
import IOptions from '../IOptions';

function removeFile(
  entryPath: string,
  result: string[],
  options: IOptions
): void {
  if (existsSync(entryPath)) {
    if (!options.dry) {
      unlinkSync(entryPath);
    }
    result.push(entryPath);
  }
}

export default removeFile;
