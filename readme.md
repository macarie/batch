# [@macarie/batch](https://github.com/macarie/batch) [![Release Version](https://img.shields.io/npm/v/@macarie/batch?label=&color=0080FF)](https://www.npmjs.com/package/@macarie/batch)

> Batch multiple function-calls into one

![Test Status Badge](https://github.com/macarie/batch/workflows/test/badge.svg) [![Codecov Code Coverage Result](https://codecov.io/gh/macarie/batch/branch/main/graph/badge.svg?token=JL1FLLY4Y6)](https://codecov.io/gh/macarie/batch)

Batches multiple function-calls into one by creating a [throttled](https://css-tricks.com/debouncing-throttling-explained-examples/) function.

Useful for batching together multiple state changes, for example.

_This module offers full TypeScript support._

## Install

```console
$ npm install @macarie/batch
```

Or if you prefer using Yarn:

```console
$ yarn add @macarie/batch
```

## Usage

```javascript
import batch from "@macarie/batch"

const f = (parameters) => {
  parameters.forEach((parameter) => console.log(parameter))
}

const batchedF = batch(f, 50)

batchedF(1, "a")
batchedF(2, "b")
batchedF(3, "c")

// After ~50ms it will log:
// => [1, 'a']
// => [2, 'b']
// => [3, 'c']
```

## API

### batch(f, interval?, options?)

Creates a throttled function that only invokes `f` at most once per every `interval` milliseconds.

When the time comes, it invokes `f` with an array that contains the arguments of every function-call that did not run, grouped, as these are collected and batched.

#### `f`

Type: `function`<br>
Required: `true`

The function that should receive batches of arguments.

#### `interval`

Type: `number`<br>
Required: `false`<br>
Default: `0`

Timespan for `limit` in milliseconds.

#### `options`

Type: `object`<br>
Required: `false`<br>

##### `limit`

Type: `number`<br>
Required: `false`<br>
Default: `Infinity`

Maximum number of function calls within an `interval`.

## More Examples

This module offers full TypeScript support so that the batched function has type hints.

```typescript
import batch from "@macarie/batch"

type ParametersType = [number, string]

const f = (parameters: ParametersType[]) => {
  parameters.forEach((parameter) => console.log(parameter))
}

const batchedF = batch(f, 50)

batchedF(1, "a")
batchedF(2, "b")

// The type checker will complain about this
//  as [string, number] is different from [number, string]
batchedF("c", 3)
```

## Todo

- [x] Add a maximum number of function calls that, when reached, bypasses the timeout.
- [ ] Implement `clear` to cancel the currently scheduled function call.
- [ ] Implement `flush` to execute the currently scheduled function call.

## License

MIT © [Raul Macarie](https://macarie.me).
