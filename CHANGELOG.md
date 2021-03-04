# lerna-audit change log

All notable changes to this project will be documented in this file.

## 1.3.1

- Bugfix: package.json - EOF newline removed ([#15](https://github.com/tnobody/lerna-audit/issues/15))

## 1.3.0

- Enhancement: Added optional parameter `--no-fix` to skip an automatic fix after an audit ([#13](https://github.com/tnobody/lerna-audit/issues/13))

## 1.2.0

- Enhancement: Restore original package json on abort ([#9](https://github.com/tnobody/lerna-audit/pull/9))

## 1.1.2

- Bugfix: Don't add empty dependencies/devDependencies fields in package.json ([#8](https://github.com/tnobody/lerna-audit/pull/8))
- Bugfix: Use local lerna ([#5](https://github.com/tnobody/lerna-audit/pull/5))

## 1.1.1

- Bugfix: Fixed version are overridden after package.json is restored ([#4](https://github.com/tnobody/lerna-audit/pull/4))

## 1.1.0

- Bugfix: Add --all flag to include private packages ([#1](https://github.com/tnobody/lerna-audit/pull/1))

## v1.0.2

- Enhancement: Backup original file instead of overwrite ([#2](https://github.com/tnobody/lerna-audit/pull/2))

## v1.0.1

- Initial Release
