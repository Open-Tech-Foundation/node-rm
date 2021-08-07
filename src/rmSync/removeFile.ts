import { unlinkSync, existsSync } from 'fs';

function removeFile(entryPath: string, result: string[]): void {
  if (existsSync(entryPath)) {
    unlinkSync(entryPath);
    result.push(entryPath);
  }
}

export default removeFile;
