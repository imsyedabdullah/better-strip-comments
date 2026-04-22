# Release history

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<details>
  <summary><strong>Guiding Principles</strong></summary>

- Changelogs are for humans, not machines.
- There should be an entry for every single version.
- The same types of changes should be grouped.
- Versions and sections should be linkable.
- The latest version comes first.
- The release date of each versions is displayed.
- Mention whether you follow Semantic Versioning.

</details>

<details>
  <summary><strong>Types of changes</strong></summary>

Changelog entries are classified using the following labels _(from [keep-a-changelog](http://keepachangelog.com/)_):

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

</details>

---

# better-strip-comments

Published to npm as `better-strip-comments`, forked from [`strip-comments@2.0.1`](https://github.com/jonschlinkert/strip-comments). The public API is unchanged from the original; version numbering restarts at `1.0.0` under the new package name.

## [1.0.0] - 2026-04-22

**Fixed**

- String-aware parsing. The original `QUOTED_STRING_REGEX` relied on a backreference inside a character class (`[^\1]`), which JavaScript silently interprets as the octal character `\x01` rather than "not the opening quote." This caused the parser to mis-tokenize strings containing comment markers — most visibly truncating everything after `'/*...'` in PHP and shell-glob inputs. Replaced with three per-quote regexes (single, double, backtick) that correctly handle escape sequences and bound single/double-quoted strings to a single line.
- PHP line-comment stripping at EOF. The old `(?=\?>|\n)` lookahead required either a PHP close tag or a newline to follow a `#` or `//` comment, so a trailing comment on the final line (no newline) was left in the output. Now also accepts end-of-string as a terminator.
- Preserved URLs (`"https://..."`), glob patterns (`'/path/**/*.js'`), hash fragments (`"#section"`), and any other comment-like substrings inside string literals.

**Added**

- New language support: Rust, Go, Kotlin (`kotlin`, `kt`), Dart, Scala, JSON with comments (`jsonc`, `json5`), JSX/TSX, Vue, Svelte, TOML, INI, YAML (`yaml`, `yml`), Shell/Bash (`shell`, `bash`, `sh`, `zsh`), PowerShell (`powershell`, `ps1`), Windows Batch (`batch`, `bat`, `cmd`), R, Elixir, SCSS, and a canonical `typescript` alias. The historical `typscript` typo-alias is retained for backward compatibility.
- PowerShell-specific block comments (`<# ... #>`).
- Batch comment detection that handles both `REM` (case-insensitive, word-bounded so `REMOTE` is not mistaken for a comment) and `::`.
- Extended test suite: 91 new tests across `test/regression.js`, `test/new-languages.js`, and `test/strings.js`, plus fixture pairs for Rust, Go, TOML, YAML, and PowerShell. Full suite (original 60 upstream tests + 91 new) runs with `npm test`.

**Changed**

- Internal `tripleQuotes` flag in the parser renamed to `symmetricBlock` and generalized: any language whose block-open and block-close regex sources are identical (e.g. Python `"""`) gets symmetric-marker handling. No behavior change for existing languages.

---

# strip-comments (original package, pre-fork history)

The entries below are from the original `strip-comments` package by Jon Schlinkert, preserved for historical reference.

## [2.0.0] - 2019-09-14

**Changed**

- Refactored again to use a custom parser that is much faster and supports a number of different languages.

## [1.0.2] - 2018-05-03

- refactored
- Remove default objectRestSpread plugin #40 allows for user configured plugins
- Merge pull request #42 from tallarium/remove-default-transform
- Merge remote-tracking branch 'origin/master' into refactor
- Merge remote-tracking branch 'origin/master' into refactor
- Merge pull request #44 from jonschlinkert/refactor

## [1.0.1] - 2018-03-24

- feat: Allow users to specify their own babylon plugins
- Merge pull request #40 from briandipalma/patch-1
- adds `allowReturnOutsideFunction` to defaults

## [1.0.0] - 2018-03-24

- adds object-rest-spread plugin

## [0.4.4] - 2016-02-14

- refactor to use babylon

## [0.4.3] - 2015-12-25

- minor tweak

## [0.4.2] - 2015-12-11

- bump extract-comments per issue https://github.com/jonschlinkert/strip-comments/issues/29
- Merge branch 'master' of https://github.com/lebbe/strip-comments into lebbe-master
- Merge branch 'lebbe-master'

## [0.4.0] - 2015-11-04

- adds more test cases
- closes https://github.com/jonschlinkert/strip-comments/issues/18
- Handles comments that are substrings of a later comment
- Merge pull request #28 from epicoxymoron/bugfix/27-discard-is-too-greedy
- adds example
- adds json test

## [0.3.4] - 2015-10-22

- refactored
- expose `first` method. code comments, minor formatting
- allow line/block to be specified as options
- Merge pull request #23 from jonschlinkert/dev
- fixes examples
- adds editorconfig

## [0.3.0] - 2014-09-02

- merge fix from origin
- Merge pull request #13 from mk-pmb/tests_literals_nocomment
- Merge pull request #15 from mk-pmb/tests_literals_snake
- Merge pull request #22 from kgryte/patch-1
- Merge pull request #9 from tunnckoCore/master
- Merge remote-tracking branch 'origin/line-comments'
- Merge remote-tracking branch 'origin/master'
- tests: not a comment: snake-y ASCII art
- tests: string and regexp literals
- adds tests for URLs
- fix globstars
- lint

## [0.2.0] - 2014-08-10

- fixes `use strict` statement

## [0.1.6] - 2014-02-13

- Merge branch 'master' of https://github.com/tunnckoCore/strip-comments into tunnckoCore-master
- Merge branch 'tunnckoCore-master'
- minor formatting

## [0.1.0] - 2014-02-10

- first commit

[1.0.2]: https://github.com/jonschlinkert/strip-comments/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/jonschlinkert/strip-comments/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/jonschlinkert/strip-comments/compare/0.4.4...1.0.0
[0.4.4]: https://github.com/jonschlinkert/strip-comments/compare/0.4.3...0.4.4
[0.4.3]: https://github.com/jonschlinkert/strip-comments/compare/0.4.2...0.4.3
[0.4.2]: https://github.com/jonschlinkert/strip-comments/compare/0.4.0...0.4.2
[0.4.0]: https://github.com/jonschlinkert/strip-comments/compare/0.3.4...0.4.0
[0.3.4]: https://github.com/jonschlinkert/strip-comments/compare/0.3.0...0.3.4
[0.3.0]: https://github.com/jonschlinkert/strip-comments/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/jonschlinkert/strip-comments/compare/0.1.6...0.2.0
[0.1.6]: https://github.com/jonschlinkert/strip-comments/compare/0.1.0...0.1.6

[Unreleased]: https://github.com/jonschlinkert/strip-comments/compare/0.1.0...HEAD
[keep-a-changelog]: https://github.com/olivierlacan/keep-a-changelog

