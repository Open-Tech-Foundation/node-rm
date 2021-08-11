import Os from 'os';
import Path from 'path';
import { existsSync } from 'fs';
import { jest } from '@jest/globals';
import { globSync } from '@open-tech-world/node-glob';

import { rmSync } from '../lib/index.esm.js';
import setup from './setup.js';

const tempDir = Os.tmpdir();
const myAppDir = Path.join(tempDir, 'my-app');

let consoleErrorSpy;
let consoleLogSpy;

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error');
  consoleLogSpy = jest.spyOn(console, 'log');
  setup();
});

describe('rmSync', () => {
  test('invalid arguments', () => {
    expect(() => rmSync()).toThrow();
    expect(() => rmSync('')).not.toThrow();
    expect(() => rmSync([])).not.toThrow();
    expect(() => rmSync('.')).not.toThrow();
    expect(() => rmSync('..')).not.toThrow();
  });

  test('Invalid cwd', () => {
    rmSync('*', { cwd: Path.join(tempDir, 'node_rm_xyz') });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('removes a file', () => {
    expect(existsSync(Path.join(myAppDir, 'notes.txt'))).toBeTruthy();
    rmSync('notes.txt', { cwd: myAppDir });
    expect(existsSync(Path.join(myAppDir, 'notes.txt'))).toBeFalsy();
  });

  it('does not removes a dot file', () => {
    expect(existsSync(Path.join(myAppDir, '.gitignore'))).toBeTruthy();
    rmSync('.gitignore', { cwd: myAppDir });
    expect(existsSync(Path.join(myAppDir, '.gitignore'))).toBeTruthy();
  });

  it('removes a dot file', () => {
    expect(existsSync(Path.join(myAppDir, '.gitignore'))).toBeTruthy();
    rmSync('.gitignore', { cwd: myAppDir, dot: true });
    expect(existsSync(Path.join(myAppDir, '.gitignore'))).toBeFalsy();
  });

  it('removes a dir', () => {
    expect(existsSync(Path.join(myAppDir, 'a'))).toBeTruthy();
    rmSync('a', { cwd: myAppDir });
    expect(existsSync(Path.join(myAppDir, 'a'))).toBeFalsy();
  });

  it('does not removes a dot dir', () => {
    expect(existsSync(Path.join(myAppDir, '.git'))).toBeTruthy();
    rmSync('.git', { cwd: myAppDir });
    expect(existsSync(Path.join(myAppDir, '.git'))).toBeTruthy();
  });

  it('removes a dot dir', () => {
    expect(existsSync(Path.join(myAppDir, '.git'))).toBeTruthy();
    rmSync('.git', { cwd: myAppDir, dot: true });
    expect(existsSync(Path.join(myAppDir, '.git'))).toBeFalsy();
  });

  it('removes multiple files', () => {
    const patterns = ['config.json', 'jest.config.js', 'tsconfig.json'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(3);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  it('removes multiple dirs', () => {
    const patterns = ['a', 'b', 'c'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(3);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  it('removes multiple files with invalid path', () => {
    const patterns = ['config2.json', 'jest.config.js', 'tsconfig.json'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(2);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  it('removes multiple dirs with invalid path', () => {
    const patterns = ['a', 'b2', 'c'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(2);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('star', () => {
    const patterns = ['*'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(15);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('star with dot', () => {
    const patterns = ['*'];
    expect(globSync(patterns, { cwd: myAppDir, dot: true })).toHaveLength(17);
    rmSync(patterns, {
      cwd: myAppDir,
      dot: true,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('star with file extensions', () => {
    const patterns = ['*.json'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(2);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('star with negation', () => {
    const patterns = ['*', '!node_modules'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(14);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('star with multiple negation', () => {
    const patterns = ['*', '!node_modules', '!*.lock'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(13);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('star with deep negation', () => {
    const patterns = [
      '*',
      '!node_modules',
      '!public/assets/logo.svg',
      '!public/assets/pdfs/[1-2].pdf',
    ];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(14);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(
      globSync(['**', '!node_modules'], { cwd: myAppDir, dirs: false })
    ).toHaveLength(3);
  });

  it('removes range of dirs', () => {
    const patterns = ['[b-d]'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(3);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  it('removes range of dirs with range negation', () => {
    const patterns = ['[^ax]'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(5);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  it('removes files with three ext chars using question mark', () => {
    const patterns = ['*.???'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(1);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('glob star', () => {
    const patterns = ['**'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(78);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('glob star with negation', () => {
    const patterns = ['**', '!**/logo.svg'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(77);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(globSync('**', { cwd: myAppDir, dirs: false })).toHaveLength(1);
  });

  test('glob star with multiple negation', () => {
    const patterns = ['**', '!**/logo.svg', '!node_modules', '!1/2/3/*'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(41);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(
      globSync(['**', '!node_modules'], { cwd: myAppDir, dirs: false })
    ).toHaveLength(4);
  });

  test('glob star with deep negation', () => {
    const patterns = [
      '**',
      '!**/logo.svg',
      '!node_modules',
      '!1/*.*',
      '!**/4/**',
    ];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(42);
    rmSync(patterns, {
      cwd: myAppDir,
    });
    expect(
      globSync(['**', '!node_modules'], { cwd: myAppDir, dirs: false })
    ).toHaveLength(4);
  });

  test('dry run glob star', () => {
    const patterns = ['**'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(78);
    rmSync(patterns, {
      cwd: myAppDir,
      dry: true,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(78);
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  test('verbose glob star', () => {
    const patterns = ['**'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(78);
    rmSync(patterns, {
      cwd: myAppDir,
      verbose: true,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
    expect(consoleLogSpy).toHaveBeenCalled();
  });
});
