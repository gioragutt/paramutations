type VariadicTupleOfVariadicTuples = readonly [
  ...(readonly [...(readonly unknown[])])
];

type ProductResult<T extends VariadicTupleOfVariadicTuples> = {
  // @ts-expect-error should be good
  [K in keyof T]: T[K][number];
};

function product<T extends VariadicTupleOfVariadicTuples>(
  arrays: T
): ProductResult<T> {
  return arrays.reduce(
    (prevAccumulator: any[][], currentArray: any[]) => {
      const newAccumulator: any[][] = [];
      prevAccumulator.forEach((prevAccumulatorArray) => {
        currentArray.forEach((currentValue) => {
          newAccumulator.push(prevAccumulatorArray.concat(currentValue));
        });
      });
      return newAccumulator;
    },
    [[]]
  ) as ProductResult<T>;
}

export type ParamValues<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K][];
};

export const paramutations = <T extends Record<string, unknown>>(
  matrix: ParamValues<T>
): T[] => {
  const inputToProduct = Object.values(matrix);
  const keys = Object.keys(matrix);
  const permutations = product(inputToProduct);

  return permutations.map((permutations) => {
    return Object.fromEntries(keys.map((k, i) => [k, permutations[i]])) as T;
  });
};
