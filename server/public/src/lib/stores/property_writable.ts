import type { Writable } from "svelte/store";
import { DerivedWritable } from "./derived_writable";

export class PropertyWritable<Value> extends DerivedWritable<object, Value> {
  constructor(
    base: Writable<object>,
    key: string,
  ) {
    super(base,
      (base) => (base as {
        [key: string]: Value;
      })[key],
      (base, value) => {
        (base as {
          [key: string]: Value;
        })[key] = value;
        return base;
      }
    );
  }
}