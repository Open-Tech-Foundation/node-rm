# @open-tech-world/node-rm

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
| colors  | boolean | true          | If false, it turns off color output.                                            |

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
