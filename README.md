# better-strip-comments

> Strip line and/or block comments from a string. Blazing fast, and works with JavaScript, Sass, CSS, Less.js, and a number of other languages.

This is a fork of [jonschlinkert/strip-comments](https://github.com/jonschlinkert/strip-comments) maintained at [imsyedabdullah/better-strip-comments](https://github.com/imsyedabdullah/better-strip-comments). The public API is 100% compatible with the original — if your code works against `strip-comments@2.0.1`, it will work against this fork unchanged.

- [What's new in this fork](#whats-new-in-this-fork)
- [Install](#install)
- [What does this do?](#what-does-this-do)
- [Usage](#usage)
- [API](#api)
- [About](#about)

## What's new in this fork

### String-aware parsing (bug fix)

The original parser used a regex with `[^\1]` inside a character class to match string bodies. Backreferences don't work inside `[...]` in JavaScript — `\1` there is interpreted as the octal character `\x01`, not as "the opening quote." In practice this meant that strings containing comment markers would sometimes break the parser, causing it to treat `/*` inside a string as the start of a real block comment and eat everything after it until EOF.

Real-world example that broke the original:

```js
const strip = require('better-strip-comments');

// PHP file containing a glob pattern inside a single-quoted string
const input = "$candidates = glob($plugin_root . '/*.php') ?: [];\nforeach ($candidates as $c) { echo $c; }";

// Original strip-comments 2.0.1: truncates everything after the '/*
// This fork:                      returns the input unchanged
console.log(strip(input));
```

The fix rewrites string tokenization to use three separate, correct regexes — one each for single quotes, double quotes, and template literals — with proper handling of escape sequences and newline bounding. URLs, glob patterns, and any other comment-like characters inside strings are now preserved correctly.

```js
strip('const url = "https://example.com/path";');
// => 'const url = "https://example.com/path";'   ✓ preserved

strip("const glob = '/path/**/*.js'; // trailing");
// => "const glob = '/path/**/*.js'; "             ✓ glob preserved, comment stripped

strip("const s = '/* not a comment */'; /* real */ const x = 1;");
// => "const s = '/* not a comment */';  const x = 1;"
```

### PHP trailing-comment-at-EOF (bug fix)

The original PHP line-comment regex required one of `?>` or `\n` to follow the comment. A trailing `#` or `//` comment on the last line of a file (no trailing newline) was silently left in the output. Fixed by also accepting end-of-string as a terminator.

```js
strip('<?php\n$x = 1; # tail', { language: 'php' });
// Original: '<?php\n$x = 1; # tail'   ✗ comment kept
// Fork:     '<?php\n$x = 1; '         ✓ comment stripped
```

### Newly supported languages

In addition to the languages the original supports, this fork adds:

| Language | Identifier(s) | Notes |
|---|---|---|
| Rust | `rust` | C-style `//` and `/* */`, including `///` and `//!` doc comments |
| Go | `go` | C-style |
| Kotlin | `kotlin`, `kt` | C-style |
| Dart | `dart` | C-style including `///` doc comments |
| Scala | `scala` | C-style |
| JSON with comments | `jsonc`, `json5` | C-style |
| JSX / TSX | `jsx`, `tsx` | Same as JS/TS; note that JSX comments are `{/* ... */}` |
| Vue / Svelte | `vue`, `svelte` | Defaults to JS-style for `<script>` blocks |
| TOML | `toml` | `#` line comments |
| INI | `ini` | Both `#` and `;` line comments |
| YAML | `yaml`, `yml` | `#` line comments |
| Shell / Bash | `shell`, `bash`, `sh`, `zsh` | `#` line comments |
| PowerShell | `powershell`, `ps1` | `#` line comments and `<# ... #>` block comments |
| Windows Batch | `batch`, `bat`, `cmd` | `REM` (case-insensitive) and `::` line comments |
| R | `r` | `#` line comments |
| Elixir | `elixir` | `#` line comments |
| SCSS | `scss` | Alias for JS-style (previously only `sass` was aliased) |
| TypeScript | `typescript` | Canonical spelling (the original `typscript` typo-alias is still accepted) |

All of these correctly preserve comment-like characters inside strings. Example:

```js
strip('name: "#not-a-comment"\n# real comment\nage: 30', { language: 'yaml' });
// => 'name: "#not-a-comment"\n\nage: 30'

strip('echo "#not a comment" # trailing', { language: 'bash' });
// => 'echo "#not a comment" '

strip('set REMOTE=1\nREM actual comment', { language: 'batch' });
// => 'set REMOTE=1\n'   // REMOTE is not mistaken for a REM comment
```

### Test coverage

The fork ships 91 new tests across three files (`test/regression.js`, `test/new-languages.js`, `test/strings.js`) plus fixture pairs for the new languages. The full test suite — original 60 upstream tests plus 91 new ones — runs with `npm test`.

---

## Install

Install with [npm](https://www.npmjs.com/) (requires [Node.js](https://nodejs.org/en/) >=10):

```sh
$ npm install --save better-strip-comments
```

Or install this fork directly from GitHub:

```sh
$ npm install --save imsyedabdullah/better-strip-comments
```

## What does this do?

Takes a string and returns a new string with comments removed. Works with line comments and/or block comments. Optionally removes the first comment only or ignores protected comments.

Works with:

* ada
* apl
* applescript
* bash / sh / zsh / shell
* batch / bat / cmd
* c
* csharp
* css
* dart
* elixir
* go
* hashbang
* haskell
* html
* ini
* java
* javascript
* jsonc / json5
* jsx / tsx
* kotlin / kt
* less
* lua
* matlab
* ocaml
* pascal
* perl
* php
* powershell / ps1
* python
* r
* ruby
* rust
* sass / scss
* scala
* shebang
* sql
* swift
* toml
* typescript / typscript / ts
* vue / svelte
* xml
* yaml / yml

## Usage

By default all comments are stripped.

```js
const strip = require('better-strip-comments');
const str = strip('const foo = "bar";// this is a comment\n /* me too */');
console.log(str);
// => 'const foo = "bar";\n'
```

To strip comments for a specific language, pass the `language` option:

```js
strip('x = 1  # comment', { language: 'python' });
// => 'x = 1  '

strip('$x = 1 # trailing\n<#\n  doc\n#>\n$y = 2', { language: 'powershell' });
// => '$x = 1 \n\n$y = 2'
```

For more use-cases see the [tests](./test).

## API

### [strip](index.js#L33)

Strip all code comments from the given `input`, including protected comments that start with `!`, unless disabled by setting `options.keepProtected` to true.

**Params**

* `input` **{String}**: string from which to strip comments
* `options` **{Object}**: optional options

    - `line` **{Boolean}**: if `false` strip only block comments, default `true`
    - `block` **{Boolean}**: if `false` strip only line comments, default `true`
    - `language` **{String}**: language name (default: `'javascript'`)
    - `keepProtected` **{Boolean}**: Keep ignored comments (e.g. `/*!` and `//!`)
    - `preserveNewlines` **{Boolean}**: Preserve newlines after comments are stripped
* `returns` **{String}**: modified input

**Example**

```js
const str = strip('const foo = "bar";// this is a comment\n /* me too */');
console.log(str);
// => 'const foo = "bar";'
```

### [.block](index.js#L54)

Strip only block comments.

**Params**

* `input` **{String}**: string from which to strip comments
* `options` **{Object}**: pass `opts.keepProtected: true` to keep ignored comments (e.g. `/*!`)
* `returns` **{String}**: modified string

**Example**

```js
const strip = require('better-strip-comments');
const str = strip.block('const foo = "bar";// this is a comment\n /* me too */');
console.log(str);
// => 'const foo = "bar";// this is a comment'
```

### [.line](index.js#L74)

Strip only line comments.

**Params**

* `input` **{String}**: string from which to strip comments
* `options` **{Object}**: pass `opts.keepProtected: true` to keep ignored comments (e.g. `//!`)
* `returns` **{String}**: modified string

**Example**

```js
const str = strip.line('const foo = "bar";// this is a comment\n /* me too */');
console.log(str);
// => 'const foo = "bar";\n/* me too */'
```

### [.first](index.js#L95)

Strip the first comment from the given `input`. Or, if `opts.keepProtected` is true, the first non-protected comment will be stripped.

**Params**

* `input` **{String}**
* `options` **{Object}**: pass `opts.keepProtected: true` to keep comments with `!`
* `returns` **{String}**

**Example**

```js
const output = strip.first(input, { keepProtected: true });
console.log(output);
// => '//! first comment\nfoo; '
```

### [.parse](index.js#L116)

Parses a string and returns a basic CST (Concrete Syntax Tree).

**Params**

* `input` **{String}**: string to parse
* `options` **{Object}**: parse options
* `returns` **{Object}**: CST

## About

<details>
<summary><strong>Running Tests</strong></summary>

Install dependencies and run tests with:

```sh
$ npm install && npm test
```

</details>

<details>
<summary><strong>Contributing</strong></summary>

This is a fork; contributions here should be fork-specific (fixes, new languages, regression tests). For issues that also affect the upstream package, please consider opening them against [the original repo](https://github.com/jonschlinkert/strip-comments) as well.

Pull requests and stars are welcome. For bugs and feature requests, [please open an issue](https://github.com/imsyedabdullah/better-strip-comments/issues/new).

</details>

### Credit

The original `strip-comments` was written by **Jon Schlinkert** — see [jonschlinkert/strip-comments](https://github.com/jonschlinkert/strip-comments). The parser architecture (CST-based parse/compile pipeline, per-language regex tables) and the public API are entirely his work. This fork's contribution is limited to bug fixes in the tokenizer and the addition of new language entries, with the original design preserved.

### License

Copyright (c) 2014-present, Jon Schlinkert.
Copyright (c) 2026, Syed Abdullah (fork modifications).

Released under the [MIT License](LICENSE).
