# Contributing

This library is a community effort: it can only be great if we all help out in one way or another!

## Development workflow

The project uses a monorepo structure for the packages managed by [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces/) and [lerna](https://lerna.js.org). To get started with the project, run `npm i` in the root directory to install the required dependencies for each package:

```sh
npm i
```

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
npm run typescript
npm run lint
```

To fix formatting errors, run the following:

```sh
npm run lint --fix
```

Remember to add tests for your change if possible. Run the unit tests by:
(Not yet implemented; there are currently no tests for these packages)

```sh
npm run test
```

### Linting and tests

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/)

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing (not yet implemented).

### Scripts

The `package.json` file contains various scripts for common tasks:

- `npm run typescript`: type-check files with TypeScript.
- `npm run lint`: lint files with ESLint.
- `npm run test`: run unit tests with Jest.
- `npm run clean`: clean all packages.
- `npm run build`: build all packages.
- `npm run publish`: publish all packages.
- `npm run release`: shorthand for build & publish.

## Publishing

Maintainers with write access to the GitHub repo and the npm organization can publish new versions. To publish a new version, first, you need to export a `GH_TOKEN` environment variable as mentioned [here](https://github.com/lerna/lerna/tree/master/commands/version#--create-release-type). Then run:

```sh
npm run release
```

This will automatically bump the version and publish the packages. It'll also publish the changelogs on GitHub for each package.
