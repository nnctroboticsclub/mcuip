import { writable, type Writable } from "svelte/store";

class SharedDataStore {
  _data: { [key: string]: Writable<undefined | object> };
  constructor() {
    this._data = {};
  }

  getData<T>(key: string): Writable<T> {
    if (!this._data[key]) {
      this._data[key] = writable();
    }
    return this._data[key] as Writable<T>;
  }

  setData<T>(key: string, value: T) {
    this.getData<T>(key).set(value);
  }

  dataList(): string[] {
    return Object.keys(this._data);
  }

}

export default new SharedDataStore();