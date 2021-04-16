/** Sequentially calls functions with the same argument. */
export const asyncSequence = <T>(
  ...fns: ReadonlyArray<(value: T) => Promise<unknown>>
): ((value: T) => Promise<void>) => async (value) =>
  fns.length === 0
    ? undefined
    : (await fns[0](value), asyncSequence<T>(...fns.slice(1))(value));
