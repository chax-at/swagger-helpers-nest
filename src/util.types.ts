export type ValueOf<T> = T[keyof T];

/** all keys of the object where the value extends TValue */
export type KeysOfType<T, TValue> = ValueOf<{
  [P in keyof T]: T[P] extends TValue ? P : never;
}>
