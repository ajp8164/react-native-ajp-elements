# React Native AJP Elements

[![MIT License][license-badge]][license]

A React Native library for apps.

## Package Versions

| Name                                                        | Latest Version                                                                                                                                            |
| ----------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------: |
| [@react-native-ajp-elements/common](/packages/common) | [![badge](https://img.shields.io/npm/v/@react-native-ajp-elements/core.svg)](https://www.npmjs.com/package/@react-native-ajp-elements/common) |
| [@react-native-ajp-elements/core](/packages/core)     | [![badge](https://img.shields.io/npm/v/@react-native-ajp-elements/core.svg)](https://www.npmjs.com/package/@react-native-ajp-elements/core) |
| [@react-native-ajp-elements/ui](/packages/ui)         | [![badge](https://img.shields.io/npm/v/@react-native-ajp-elements/core.svg)](https://www.npmjs.com/package/@react-native-ajp-elements/ui) |

## Contributing

Please read through our [contribution guide](CONTRIBUTING.md) to get started!

## Installing from a fork on GitHub

Since we use a monorepo, it's not possible to install a package from the repository URL. If you need to install a forked version from Git, you can use [`gitpkg`](https://github.com/ramasilveyra/gitpkg).

First install `gitpkg`:

```sh
npm install --global gitpkg
```

Then follow these steps to publish and install a forked package:

1. Fork this repo to your account and clone the forked repo to your local machine
1. Open a Terminal and `cd` to the location of the cloned repo
1. Run `npm i` to install any dependencies
1. If you want to make any changes, make them and commit
1. Run `npm run build` to perform the build steps
1. Now `cd` to the package directory that you want to use (e.g. `cd packages/core` for `@react-native-ajp-elements/core`)
1. Run `gitpkg publish` to publish the package to your repo

After publishing, you should see something like this:

```sh
Package uploaded to git@github.com:<user>/<repo>.git with the name <name>
```

You can now install the dependency in your project:

```sh
npm i <user>/<repo>.git#<name>
```

Remember to replace `<user>`, `<repo>` and `<name>` with right values.

## Installing from a fork on GitHub

Since we use a monorepo, it's not possible to install a package from the repository URL. If you need to install a forked version from Git, you can use [`gitpkg`](https://github.com/ramasilveyra/gitpkg).

First install `gitpkg`:

```sh
npm install --global gitpkg
```

Then follow these steps to publish and install a forked package:

1. Fork this repo to your account and clone the forked repo to your local machine
1. Open a Terminal and `cd` to the location of the cloned repo
1. Run `npm i` to install any dependencies
1. If you want to make any changes, make them and commit
1. Run `npm run build` to perform the build steps
1. Now `cd` to the package directory that you want to use (e.g. `cd packages/core` for `@react-native-ajp-elements/core`)
1. Run `gitpkg publish` to publish the package to your repo

After publishing, you should see something like this:

```sh
Package uploaded to git@github.com:<user>/<repo>.git with the name <name>
```

You can now install the dependency in your project:

```sh
npm i <user>/<repo>.git#<name>
```

Remember to replace `<user>`, `<repo>` and `<name>` with right values.
