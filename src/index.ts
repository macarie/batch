interface Options {
  /**
		Maximum number of calls within an `interval`.

    @default Number.POSITIVE_INFINITY
		*/
  readonly limit?: number
}

/**
 * Batches multiple function-calls into one by creating a [throttled](https://css-tricks.com/debouncing-throttling-explained-examples/) function.
 * When the time comes, it invokes `f` with an array that contains the arguments of every function-call that did not run, grouped, as these are collected and batched.
 *
 * @param f The function you want to throttle.
 * @param interval Timespan for `limit` in milliseconds.
 *
 * @returns A throttled version of `f` that receives the arguments of every call made between executions.
 *
 * @example
 * ```javascript
 * import batch from "@macarie/batch"
 *
 * const createNewState = (parameters) => {
 *   let state = {}
 *
 *   for (const [parameter] of parameters) {
 *     state = {
 *       ...state,
 *       ...parameter,
 *     }
 *   }
 *
 *   console.log(state)
 * }
 * const setState = batch(createNewState, 5)
 *
 * for (let i = 0; i < 5; i += 1) {
 *   setState({ [`index-${i}`]: Math.random() })
 * }
 * ```
 */
const batch = <T extends unknown[]>(
  f: (parameters: T[]) => void,
  interval = 0,
  { limit = Number.POSITIVE_INFINITY }: Options = {}
): ((...parameters: T) => void) => {
  if (typeof interval !== 'number' || interval < 0) {
    throw new TypeError('Expected the second argument to be a positive number')
  }

  if (typeof f !== 'function') {
    throw new TypeError('Expected the first argument to be a function')
  }

  if (typeof limit !== 'number' || limit < 0) {
    throw new TypeError('Expected the `limit` option to be a positive number')
  }

  let timesCalled = 0
  let args: T[] = []
  let timeout: ReturnType<typeof setTimeout> | undefined

  return (...parameters: T): void => {
    timesCalled += 1
    args.push(parameters)

    if (timesCalled === 1) {
      timeout = setTimeout(() => {
        f(args)

        timesCalled = 0
        args = []
        timeout = undefined
      }, interval)
    }

    if (timesCalled > limit) {
      f(args)

      timesCalled = 0
      args = []

      if (timeout !== undefined) {
        clearTimeout(timeout)

        timeout = undefined
      }
    }
  }
}

export default batch
