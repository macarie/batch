import { test } from 'uvu'
import * as assert from 'uvu/assert'

import delay from 'delay'

import batch from '../src/index'

type ArgumentsType = [number, string, boolean]

test('should batch calls every 10ms', async () => {
  let argumentsReceived: ArgumentsType[] = []

  const testFunction = (args: ArgumentsType[]) => {
    argumentsReceived = args
  }

  const batchedFunction = batch(testFunction, 10)

  batchedFunction(1, 'a', true)
  batchedFunction(2, 'b', false)
  batchedFunction(3, 'c', true)

  await delay(15)
  assert.equal(argumentsReceived, [
    [1, 'a', true],
    [2, 'b', false],
    [3, 'c', true],
  ])

  batchedFunction(4, 'd', false)
  batchedFunction(5, 'e', true)
  batchedFunction(6, 'f', false)

  await delay(15)
  assert.equal(argumentsReceived, [
    [4, 'd', false],
    [5, 'e', true],
    [6, 'f', false],
  ])
})

test('should batch calls every 30ms', async () => {
  let argumentsReceived: ArgumentsType[] = []

  const testFunction = (args: ArgumentsType[]) => {
    argumentsReceived = args
  }

  const batchedFunction = batch(testFunction, 30)

  batchedFunction(1, 'a', true)
  batchedFunction(2, 'b', false)
  batchedFunction(3, 'c', true)

  await delay(5)
  assert.equal(argumentsReceived, [])

  await delay(5)
  assert.equal(argumentsReceived, [])

  await delay(25)
  assert.equal(argumentsReceived, [
    [1, 'a', true],
    [2, 'b', false],
    [3, 'c', true],
  ])
})

test('when the function is called more times than `limit` allows, it should run immediately', async () => {
  let argumentsReceived: ArgumentsType[] = []

  const testFunction = (args: ArgumentsType[]) => {
    argumentsReceived = args
  }

  const batchedFunction = batch(testFunction, 30, { limit: 2 })

  batchedFunction(1, 'a', true)
  batchedFunction(2, 'b', false)

  assert.equal(argumentsReceived, [])

  batchedFunction(3, 'c', true)

  assert.equal(argumentsReceived, [
    [1, 'a', true],
    [2, 'b', false],
    [3, 'c', true],
  ])
})

test('`limit` should work when it is set to 0', async () => {
  let argumentsReceived: ArgumentsType[] = []

  const testFunction = (args: ArgumentsType[]) => {
    argumentsReceived = args
  }

  const batchedFunction = batch(testFunction, 30, { limit: 0 })

  batchedFunction(1, 'a', true)

  assert.equal(argumentsReceived, [[1, 'a', true]])

  batchedFunction(2, 'b', false)

  assert.equal(argumentsReceived, [[2, 'b', false]])

  batchedFunction(3, 'c', true)

  assert.equal(argumentsReceived, [[3, 'c', true]])

  argumentsReceived = []

  await delay(50)
  assert.equal(argumentsReceived, [])
})

test('should throw if `f` is not a function', () => {
  assert.throws(
    () => batch({} as unknown as (parameters: unknown[][]) => void, 0),
    (error) =>
      error instanceof TypeError &&
      error.message === 'Expected the first argument to be a function'
  )
})

test('should throw if `interval` is not a number', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const testFunction = () => {}

  assert.throws(
    () => batch(testFunction, [] as unknown as number),
    (error) =>
      error instanceof TypeError &&
      error.message === 'Expected the second argument to be a positive number'
  )
})

test('should throw if `interval` is a negative number', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const testFunction = () => {}

  assert.throws(
    () => batch(testFunction, -1),
    (error) =>
      error instanceof TypeError &&
      error.message === 'Expected the second argument to be a positive number'
  )
})

test('should throw if `limit` is not a number', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const testFunction = () => {}

  assert.throws(
    () => batch(testFunction, 0, { limit: [] as unknown as number }),
    (error) =>
      error instanceof TypeError &&
      error.message === 'Expected the `limit` option to be a positive number'
  )
})

test('should throw if `limit` is a negative number', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const testFunction = () => {}

  assert.throws(
    () => batch(testFunction, 0, { limit: -1 }),
    (error) =>
      error instanceof TypeError &&
      error.message === 'Expected the `limit` option to be a positive number'
  )
})

test('`this` should be preserved', async () => {
  type ContextType = {
    this: 'yay'
  }

  const context: ContextType = {
    this: 'yay',
  }

  let contextReceived: ContextType

  const testFunction = function (this: ContextType) {
    // eslint-disable-next-line unicorn/no-this-assignment
    contextReceived = this
  }.bind(context)
  const batchedFunction = batch(testFunction, 10)

  batchedFunction(1, 'a', true)
  batchedFunction(2, 'b', false)
  batchedFunction(3, 'c', true)

  assert.equal(contextReceived, undefined)

  await delay(15)
  assert.equal(contextReceived, { this: 'yay' })
})

test.run()
