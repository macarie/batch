/**
 * Batches multiple function-calls into one by creating a throttled function that only invokes `f` at most once per every `wait` milliseconds.
 * When the time comes, it invokes `f` with an array that contains the arguments of every function-call that did not run, grouped, as these are collected and batched.
 *
 * @param f The function to throttle that should be invoked with batched arguments.
 * @param wait The number of milliseconds to throttle invocations to.
 * @returns Returns the new throttled function.
 */
const batch = <T extends unknown[]>(
  f: (parameters: T[]) => void,
  wait = 0
): ((...parameters: T) => void) => {
  if (typeof wait !== 'number' || wait < 0) {
    throw new TypeError('Expected the second argument to be a positive number')
  }

  if (typeof f !== 'function') {
    throw new TypeError('Expected the first argument to be a function')
  }

  let throttled = false
  let args: T[] = []

  return (...parameters: T): void => {
    args.push(parameters)

    if (!throttled) {
      throttled = true

      setTimeout(() => {
        f(args)

        throttled = false
        args = []
      }, wait)
    }
  }
}

export default batch
