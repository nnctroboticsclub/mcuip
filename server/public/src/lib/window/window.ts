import type { Area } from "$lib/ui/area";
import { AreaStore } from "$lib/ui/area_store";
import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

export type WindowStatus = "Uninitialized" | "Closing" | "Loaded";

export type DataStore = { [key: string]: Writable<any> };

export class WindowConfig {
  private area_: AreaStore;
  private status_: Writable<WindowStatus> = writable("Uninitialized");
  private tag_: string = "window";

  constructor(
    area: Writable<Area>,
    private app_name_: string,
    private window_data_: DataStore,
    private z_index_: Writable<number>
  ) {
    this.area_ = new AreaStore(area);
    this.tag_ = Math.random().toString(36).slice(2, 10);
  }

  setStatus(status: WindowStatus) {
    this.status_.set(status);
  }

  get area(): AreaStore {
    return this.area_;
  }

  get app_name(): string {
    return this.app_name_;
  }

  get status(): Writable<WindowStatus> {
    return this.status_;
  }

  get window_data(): { [key: string]: Writable<any> } {
    return this.window_data_;
  }

  get tag(): string {
    return this.tag_;
  }

  get z_index(): Writable<number> {
    return this.z_index_;
  }

  set z_index(z_index: Writable<number>) {
    this.z_index_ = z_index;
  }

  getDataStore<T>(key: string): Writable<T> {
    if (!this.window_data_[key]) {
      this.window_data_[key] = writable();
    }

    return this.window_data_[key];
  }
};

export function setWindow(index: WindowConfig) {
  setContext("window", index);
  return index;
}

export function getWindow(): WindowConfig {
  return getContext("window");
}