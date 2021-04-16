/** Sequentially calls functions with the same argument. */
export const asyncSequence = <T extends ReadonlyArray<unknown>>(
  ...fns: ReadonlyArray<(...args: T) => Promise<unknown>>
): ((...args: T) => Promise<void>) => async (...args) =>
  fns.length === 0
    ? undefined
    : (await fns[0](...args), asyncSequence<T>(...fns.slice(1))(...args));
