import { rmdirSync, existsSync } from 'fs';

function removeDir(entryPath: string, result: string[]): void {
  if (existsSync(entryPath)) {
    rmdirSync(entryPath, { recursive: true });
    result.push(entryPath);
  }
}

export default removeDir;
