import { writable, type Writable } from "svelte/store";

class SharedDataStore {
  _data: { [key: string]: Writable<undefined | object> };
  keys_: Writable<string[]>;
  constructor() {
    this._data = {};
    this.keys_ = writable([]);
  }

  getData<T>(key: string): Writable<T> {
    if (!this._data[key]) {
      this._data[key] = writable();
      this.keys_.update((keys) => [...keys, key]);
    }
    return this._data[key] as Writable<T>;
  }

  setData<T>(key: string, value: T) {
    this.getData<T>(key).set(value);
  }

  dataList(): string[] {
    return Object.keys(this._data);
  }

  dataListStore(): Writable<string[]> {
    return this.keys_;
  }

}

export const shared_data = new SharedDataStore();