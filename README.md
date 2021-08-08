<div align="center">

# @open-tech-world/node-rm
[![Linux Build](https://github.com/open-tech-world/node-rm/actions/workflows/linux_build.yml/badge.svg)](https://github.com/open-tech-world/node-rm/actions/workflows/linux_build.yml) [![macOS Build](https://github.com/open-tech-world/node-rm/actions/workflows/macos_build.yml/badge.svg)](https://github.com/open-tech-world/node-rm/actions/workflows/macos_build.yml) [![Windows Build](https://github.com/open-tech-world/node-rm/actions/workflows/windows_build.yml/badge.svg)](https://github.com/open-tech-world/node-rm/actions/workflows/windows_build.yml) [![CodeFactor](https://www.codefactor.io/repository/github/open-tech-world/node-rm/badge)](https://www.codefactor.io/repository/github/open-tech-world/node-rm) ![npm](https://img.shields.io/npm/v/@open-tech-world/node-rm?color=blue)

</div>

> Remove files & directories using [glob](<https://en.wikipedia.org/wiki/Glob_(programming)>) patterns.


Internally it uses [open-tech-world/node-glob](https://github.com/open-tech-world/node-glob) for matching files & directories. Refer it for supported glob patterns and more info.

## Features

✔️ Sync API

🚧 Async API

✔️ Supports Multiple Patterns

## Installation

Using npm

```shell
npm install @open-tech-world/node-rm
```

Using Yarn

```shell
yarn add @open-tech-world/node-rm
```

## Usage

```ts
import { rmSync } from '@open-tech-world/node-rm';

rmSync(patterns: string | string[],
       options?: Partial<IOptions>): void;
```

#### Options

| Name    | Type    | Default       | Description                                                                     |
| ------- | ------- | ------------- | ------------------------------------------------------------------------------- |
| cwd     | string  | process.cwd() | The current working directory in which to remove files & folders.               |
| dot     | boolean | false         | If true, it removes files & directories that begin with a `"."`(dot) character. |
| verbose | boolean | false         | If true, the current status will be output to the console.                      |
| colors  | boolean | false          | If true, it turns on color output.                                            |
| dry  | boolean | false          | If true, it does not remove anything instead, it console logs what would be removed.                                            |

## Examples

```shell
my-app/
├─ node_modules/
├─ public/
│  ├─ favicon.ico
│  ├─ index.html
│  ├─ robots.txt
├─ src/
│  ├─ index.css
│  ├─ index.js
├─ .gitignore
├─ package.json
├─ README.md
```

```ts
import { rmSync } from '@open-tech-world/node-rm';

rmSync('public/*', { cwd: 'my-app', verbose: true });

// my-app/public/favicon.ico
// my-app/public/index.html
// my-app/public/robots.txt
```

```ts
import { rmSync } from '@open-tech-world/node-rm';

rmSync(['public/*', '!**/robots.txt'], { cwd: 'my-app', verbose: true });

// my-app/public/favicon.ico
// my-app/public/index.html
```

## License

Copyright (c) 2021, [Thanga Ganapathy](https://thanga-ganapathy.github.io) ([MIT License](./LICENSE)).
