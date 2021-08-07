import Os from 'os';
import Path from 'path';
import { existsSync, mkdirSync, rmdirSync, writeFileSync } from 'fs';

function setup() {
  const tempDir = Path.join(Os.tmpdir(), 'my-app');
  const paths = [
    '.gitignore',
    '.git/branches/b1',
    '.git/branches/b2',
    'notes.txt',
    '1/one.html',
    '1/2/two.html',
    '1/2/3/three.html',
    '1/2/3/4/four.html',
    '1/2/3/4/5/five.html',
    'a/a.txt',
    'a/a2/a2.txt',
    'b/b.png',
    'c/c.js',
    'd/d.ts',
    'e/e.md',
    'x/y/z/x.json',
    'config.json',
    'yarn.lock',
    'src/index.js',
    'node_modules/mod1/lib/index.js',
    'node_modules/mod2/lib/index.js',
    'node_modules/mod3/lib/index.js',
    'node_modules/mod4/lib/index.js',
    'node_modules/mod5/lib/index.js',
    'node_modules/mod6/lib/index.js',
    'node_modules/mod7/lib/index.js',
    'node_modules/mod8/lib/index.js',
    'node_modules/mod9/lib/index.js',
    'node_modules/mod10/lib/index.js',
    'jest.config.js',
    'tsconfig.json',
    'public/assets/logo.svg',
    'public/assets/banner.png',
    'public/assets/banner(old).png',
    'public/assets/welcome.gif',
    'public/assets/img[01].jpg',
    'public/assets/img[02].jpg',
    'public/assets/img[03].jpg',
    'public/assets/pdfs/1.pdf',
    'public/assets/pdfs/2.pdf',
    'public/assets/pdfs/3.pdf',
    'public/robots.txt',
  ];

  if (existsSync(tempDir)) {
    rmdirSync(tempDir, { recursive: true });
  }

  mkdirSync(tempDir);

  paths.forEach((path) => {
    mkdirSync(Path.join(tempDir, Path.dirname(path)), { recursive: true });
    writeFileSync(Path.join(tempDir, path), path);
  });
}

export default setup;
