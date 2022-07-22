declare type TypeFromArray<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer TypeFromArray>
  ? TypeFromArray
  : never;
