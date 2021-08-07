import Os from 'os';
import Path from 'path';
import { existsSync } from 'fs';
import { jest } from '@jest/globals';
import { globSync } from '@open-tech-world/node-glob';

import { syncRm } from '../lib/index.js';
import setup from './setup.js';

const tempDir = Os.tmpdir();
const myAppDir = Path.join(tempDir, 'my-app');

let consoleErrorSpy;

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error');
  setup();
});

describe('syncRm', () => {
  test('invalid arguments', () => {
    expect(() => syncRm()).toThrow();
    expect(() => syncRm('')).not.toThrow();
    expect(() => syncRm([])).not.toThrow();
    expect(() => syncRm('.')).not.toThrow();
    expect(() => syncRm('..')).not.toThrow();
  });

  test('Invalid cwd', () => {
    syncRm('*', { cwd: Path.join(tempDir, 'node_rm_xyz') });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('removes a file', () => {
    expect(existsSync(Path.join(myAppDir, 'notes.txt'))).toBeTruthy();
    syncRm('notes.txt', { cwd: myAppDir });
    expect(existsSync(Path.join(myAppDir, 'notes.txt'))).toBeFalsy();
  });

  it('does not removes a dot file', () => {
    expect(existsSync(Path.join(myAppDir, '.gitignore'))).toBeTruthy();
    syncRm('.gitignore', { cwd: myAppDir });
    expect(existsSync(Path.join(myAppDir, '.gitignore'))).toBeTruthy();
  });

  it('removes a dot file', () => {
    expect(existsSync(Path.join(myAppDir, '.gitignore'))).toBeTruthy();
    syncRm('.gitignore', { cwd: myAppDir, dot: true });
    expect(existsSync(Path.join(myAppDir, '.gitignore'))).toBeFalsy();
  });

  it('removes a dir', () => {
    expect(existsSync(Path.join(myAppDir, 'a'))).toBeTruthy();
    syncRm('a', { cwd: myAppDir });
    expect(existsSync(Path.join(myAppDir, 'a'))).toBeFalsy();
  });

  it('does not removes a dot dir', () => {
    expect(existsSync(Path.join(myAppDir, '.git'))).toBeTruthy();
    syncRm('.git', { cwd: myAppDir });
    expect(existsSync(Path.join(myAppDir, '.git'))).toBeTruthy();
  });

  it('removes a dot dir', () => {
    expect(existsSync(Path.join(myAppDir, '.git'))).toBeTruthy();
    syncRm('.git', { cwd: myAppDir, dot: true });
    expect(existsSync(Path.join(myAppDir, '.git'))).toBeFalsy();
  });

  it('removes multiple files', () => {
    const patterns = ['config.json', 'jest.config.js', 'tsconfig.json'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(3);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  it('removes multiple dirs', () => {
    const patterns = ['a', 'b', 'c'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(3);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  it('removes multiple files with invalid path', () => {
    const patterns = ['config2.json', 'jest.config.js', 'tsconfig.json'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(2);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  it('removes multiple dirs with invalid path', () => {
    const patterns = ['a', 'b2', 'c'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(2);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('star', () => {
    const patterns = ['*'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(14);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('star with dot', () => {
    const patterns = ['*'];
    expect(globSync(patterns, { cwd: myAppDir, dot: true })).toHaveLength(16);
    syncRm(patterns, {
      cwd: myAppDir,
      dot: true,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('star with file extensions', () => {
    const patterns = ['*.json'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(2);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('star with negation', () => {
    const patterns = ['*', '!node_modules'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(13);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('star with multiple negation', () => {
    const patterns = ['*', '!node_modules', '!*.lock'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(12);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('star with deep negation', () => {
    const patterns = ['*', '!node_modules', '!public/assets/logo.svg'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(13);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(
      globSync(['**', '!node_modules'], { cwd: myAppDir, dirs: false })
    ).toHaveLength(1);
  });

  it('removes range of dirs', () => {
    const patterns = ['[b-d]'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(3);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  it('removes range of dirs with range negation', () => {
    const patterns = ['[^ax]'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(4);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  it('removes files with three ext chars using question mark', () => {
    const patterns = ['*.???'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(1);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('glob star', () => {
    const patterns = ['**'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(41);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(0);
  });

  test('glob star with negation', () => {
    const patterns = ['**', '!**/logo.svg'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(40);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync('**', { cwd: myAppDir, dirs: false })).toHaveLength(1);
  });

  test('glob star with multiple negation', () => {
    const patterns = ['**', '!**/logo.svg', '!node_modules'];
    expect(globSync(patterns, { cwd: myAppDir })).toHaveLength(36);
    syncRm(patterns, {
      cwd: myAppDir,
    });
    expect(globSync('**', { cwd: myAppDir, dirs: false })).toHaveLength(2);
  });
});
