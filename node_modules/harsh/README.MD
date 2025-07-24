# Harsh

_A number-hash ready to go for Talk Like A Pirate Day._

[![Circle CI](https://circleci.com/gh/patrickfatrick/harsh.svg?style=shield)](https://circleci.com/gh/patrickfatrick/harsh)
[![codecov.io](https://codecov.io/github/patrickfatrick/harsh/coverage.svg?branch=master)](https://codecov.io/github/patrickfatrick/harsh?branch=master)
[![bitHound Score](https://www.bithound.io/github/patrickfatrick/harsh/badges/score.svg)](https://www.bithound.io/github/patrickfatrick/harsh)
[![bitHound Dependencies](https://www.bithound.io/github/patrickfatrick/harsh/badges/dependencies.svg)](https://www.bithound.io/github/patrickfatrick/harsh/master/dependencies/npm)
[![MIT License][license-image]][license-url]
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

## What is it?

Harsh is a tiny library for tokenizing lists of numbers, and then subsequently reversing those tokens back to the original numbers. You can also create a token from nothing by calling it with no arguments.

**NOTE: This library should never be used for serious encryption. It is strictly a tokenizer.**

## Changelog

#### v1.5 `hashish` now accepts arguments. You can only provide one id (so no array), both otherwise the arguments are the same as for `hash`.

#### v.1.4

Build process now uses Rollup, which reduces the size a bit but also makes it possible to export a native module. Dist folder now contains `harsh.js` which is the native module, `harsh.umd.js` which uses the universal module definition, capable for `<script>` and node usage, and `harsh.min.js` which is just the minified version of the umd file.

#### v1.3

Added a new method `hashish` which just returns a single token (no object), to simplify the API for this scenario when you just need to create a single random token.

#### v1.2.2

All functions have been made free-standing so you can now import them individually, `import { hash } from 'harsh'`, etc.

## Install

```bash
$ git clone git@github.com:patrickfatrick/harsh.git
$ npm install harsh
$ bower install harsh
```

You can either use it as a module or include the minified file from the `dist` folder in a script tag.

## Usage

Harsh basically stringifies the numbers you feed it, and appends randomly generated salts to them in a random order. The salts will always be the same for the entire array, which makes them trivial to reverse, provided that stored the salts. The implementation goes like so:

```javascript
harsh.hash([number array[, number of salts[, base]]])
// number array defaults to an array containing one random number
// number of salts defaults to 2,
// base defaults to 36
```

```javascript
hash() // Create a single token using a random number
hash([1234, 5678]) // Create two tokens that will reverse back to 1234 and 5678
hash([1234, 5678], 3) // Create two tokens that will have 3 salts appended to them
hash([1234, 5678], 3, 16) // Create two tokens with 3 salts and using base-16 (hexadecimal)
```

resulting in something like

```javascript
// 1wapgwcgl
// j9exyab2rt, j9exb2rt4dq
// ggtdbrhfyaget1, 4dqbrhfget1ggtd
// 55e8a353c53b8124d2, 55e8a3b812353c5162e
```

Well really, what it returns is an object that contains the following properties

```javascript
ids: [1234, 5678], // the array of numbers used
hashes: ['55e8a353c53b8124d2', '55e8a3b812353c5162e'], // the tokens created
salts: ['55e8a', '353c5', '3b812'], // the salts created
base: 16 // the base used for tokenization
```

If you want to eventually reverse tokens back to the original numbers you will need to store this object somewhere, or at least the salts (assuming you're consistent with the base).

#### Hash-ish

This is a very simple API to just return one token as a string (no object).

```javascript
hashish() // => 5hfda2fw79
hashish(1234, 2, 36) // Receives the same arguments as `hash`, but just for one id if specified
```

#### Creating a 'bunch'

To create a specified number of random tokens, use `bunch()`. Instead of an array of numbers as the first argument `bunch` accepts a number, and will create that many tokens based on random numbers.

```
bunch([number of tokens[, number of salts[, base]]])
// number of tokens defaults to 1
// number of salts defaults to 2,
// base defaults to 36
```

For example,

```javascript
bunch() // Creates one token
bunch(5) // Creates five tokens
bunch(5, 3) // Creates five tokens with three salts appended to each one
bunch(5, 3, 16) // Creates five tokens with three salts, and using base-16 (hexadecimal)
```

This method returns an object with all the same properties as `hash()`.

#### Reversing

Reversing works very similarly, the format is

```
reverse([token array[, salts array[, base]]])
// base defaults to 36
```

So to reverse the first token from before, 

```javascript
reverse(['55e8a353c53b8124d2'], ['55e8a', '353c5', '3b812'], 16)
// [1234] Note this also returns an array.
```

The base and salts must match the original hashing, or this will not work.

## Running the tests

```bash
$ npm install
$ npm test
```

## License

Harsh is freely distributable under the terms of the [MIT license](./LICENSE).

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE