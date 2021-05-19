# Contributing to Storefront Data Hooks

## Reporting Issues

* Please include a clear, specific title and replicable description.

* Please include your environment, OS, and any exceptions/backtraces that occur. The more
information that is given, the more likely we can debug and fix the issue.

## Suggesting new features

If you are here to suggest a feature, first create an issue if it does not already exist. From there, we will discuss use-cases for the feature and then finally discuss how it could be implemented.

## Development

First ensure that your feature isn't already being developed or considered (see open PRs and issues). If it is, please consider contributing to those initiatives.

Steps to get started:

- Fork this repository
- Install dependencies by running `$ yarn`
- Link `@bigcommerce/storefront-data-hooks` locally by running `$ yarn link`
- Auto-build files as you edit by running `$ yarn start`
- Implement your changes and tests to files in the `src/` directory and corresponding test files
- Run a project that uses this package
- To run a project using your local build, link to the local `@bigcommerce/storefront-data-hooks` by running `$ yarn link @bigcommerce/storefront-data-hooks` from the project directory
- Document your changes in the appropriate doc page
- Git stage your required changes and commit (we recommend following [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines))
- Submit PR for review pointing to `develop`

## Pull requests

Maintainers merge pull requests by squashing all commits and editing the commit message if necessary using the GitHub user interface.

Use an appropriate commit type. Be especially careful with breaking changes. We recommend following [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)

## Releases

When it is decided that a new version is needed, the maintainers will create a PR with all the changes from `develop` to `master`. Once accepted and merged, a new release will be generated on GitHub and a GitHub Action will be triggered to publish the package to **npm**.

<!-- TODO: Consider to integrate semantic-release -->

## Other Ways to Contribute

* Consider contributing to documentation, reporting bugs, or helping spread the word about `storefront-data-hooks`.

Thank you again for your interest in contributing! We're happy to have you here :)
