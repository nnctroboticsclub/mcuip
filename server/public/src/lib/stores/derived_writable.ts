import type { Updater, Writable } from "svelte/store";

export type Converter<Base, Derived> = (obj: Base) => Derived;
export type Setter<Base, Derived> = (obj: Base, value: Derived) => Base;

export class DerivedWritable<BaseDataType, DerivedDataType> implements Writable<DerivedDataType> {
  private converter: Converter<BaseDataType, DerivedDataType>;
  private updater: Setter<BaseDataType, DerivedDataType>;

  constructor(
    private base: Writable<BaseDataType>,
    converter: Converter<BaseDataType, DerivedDataType>,
    setter: Setter<BaseDataType, DerivedDataType>
  ) {
    this.converter = converter;
    this.updater = setter;
  }

  subscribe(fn: (value: DerivedDataType) => void, invalidate?: (value?: DerivedDataType) => void) {
    const wrapped_subscriber = (area: BaseDataType) => {
      fn(this.converter(area));
    };

    const wrapped_invalidate = !invalidate ? undefined : (area?: BaseDataType) => {
      if (!area) {
        invalidate(undefined);
        return;
      }
      invalidate(this.converter(area));
    }

    return this.base.subscribe(wrapped_subscriber, wrapped_invalidate);
  }

  set(value: DerivedDataType) {
    this.base.update(x => {
      return this.updater(x, value);
    });
  }

  update(fn: Updater<DerivedDataType>) {
    this.base.update(x => {
      const new_position = fn(this.converter(x));
      return this.updater(x, new_position);
    });
  }
}