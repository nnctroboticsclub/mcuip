import { derived, writable, type Writable } from "svelte/store";

export interface SharedDataInterface {
  getDataState(): Writable<string>;
}

class SharedDataStore {
  _data: { [key: string]: SharedDataInterface };
  keys_: Writable<string[]>;

  constructor() {
    this._data = {};
    this.keys_ = writable([]);
  }

  getData<T extends SharedDataInterface>(key: string) {
    if (!this._data[key]) {
      return null;
    }
    return this._data[key] as T;
  }

  setData<T extends SharedDataInterface>(key: string, value: T): T {
    this._data[key] = value;
    this.keys_.set(Object.keys(this._data));

    return value;
  }

  dataList(): string[] {
    return Object.keys(this._data);
  }

  dataListStore() {
    return derived(this.keys_, (keys) =>
      keys.map((key) => {
        return {
          key: key,
          value: this._data[key].getDataState()
        }
      })
    );
  }
}

export const shared_data = new SharedDataStore();