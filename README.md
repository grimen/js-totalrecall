
# `js-totalrecall` [![NPM version](https://badge.fury.io/js/%40grimen%2Ftotalrecall.svg)](https://badge.fury.io/js/%40grimen%2Ftotalrecall) [![Build Status](https://travis-ci.com/grimen/js-totalrecall.svg?token=sspjPRWbecBSpceU8Jyn&branch=master)](https://travis-ci.com/grimen/js-totalrecall)

*A runtime step profiler - for Node/JavaScript.*


## Introduction

Aggregating runtime statistics and/or finding bottlenecks in code is one of the most common challenges as a software engineer. This is a library to aid that. In comparison to most existing libraries this one is focused on **step profiling**; aggregation of runtime information in steps marked by keys/tags/labels and optional meta data, which is used to create a summary of all steps in form of a transaction.

This is an **MVP** that most likely will be extended with more profiling features.


# Install

Install using **npm**:

```bash
$ npm install @grimen/totalrecall
```

Install using **yarn**:

```bash
$ yarn add @grimen/totalrecall
```


# Use

Very basic **[example](https://github.com/grimen/js-totalrecall/tree/master/examples/basic.js)**:

```javascript
const totalrecall = require('@grimen/totalrecall')

const sleep = (seconds = 0) => {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000)
    })
}

// ---------------------------------------------------
//   EXAMPLE: runtime step profiler
// ------------------------------------------------

let profiler = totalrecall.timer('profile something - using timer', {
    begin: false,
})

profiler.begin('task 1')

await sleep(0.1)

profiler.begin('task 2')

await sleep(0.2)

profiler.begin('task 3')

await sleep(0.3)

profiler.end()

console.log('[profiler.time / basic]: TIME:', profiler.time)
console.log('[profiler.time / basic]: STEPS:', profiler.steps)

// ---------------------------------------------------
//   EXAMPLE: runtime step profiler (detailed)
// ------------------------------------------------

profiler = totalrecall.timer('profile something - using timer', {
    begin: false,
    enabled: true,
    verbose: true,
    colors: true,
})

profiler.begin('task 1')

await sleep(0.1)

profiler.begin('task 2')

await sleep(0.2)

profiler.begin('task 3')

await sleep(0.3)

profiler.end()

console.log('[profiler.time / detailed]: TIME:', profiler.time)
console.log('[profiler.time / detailed]: STEPS:', profiler.steps)
```


# Test

Clone down source code:

```sh
$ make install
```

Run **colorful tests** using **jest**:

```sh
$ make test
```


## About

This project was mainly initiated - in lack of solid existing alternatives - to be used at our work at **[Markable.ai](https://markable.ai)** to have common code conventions between various programming environments where **Node.js** (for I/O heavy operations) is heavily used.


## Credits

Thanks to **[op-bk](https://github.com/op-bk)** for creative help with naming this library.


## License

Released under the MIT license.
