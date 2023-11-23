import type { Area } from "$lib/ui/area";
import { AreaStore } from "$lib/ui/area_store";
import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

export class WindowConfig {
  private area_: AreaStore;
  private app_name_: string;
  private window_data_: Writable<any>;
  private status_: Writable<string> = writable("Uninitialized");

  constructor(area: Writable<Area>, app_name: string, window_data: Writable<any>) {
    this.area_ = new AreaStore(area);
    this.app_name_ = app_name;
    this.window_data_ = window_data;
  }

  setStatus(status: string) {
    this.status_.set(status);
  }

  get area(): AreaStore {
    return this.area_;
  }

  get app_name(): string {
    return this.app_name_;
  }

  get window_data(): Writable<any> {
    return this.window_data_;
  }

  get status(): Writable<string> {
    return this.status_;
  }
};

export function setWindow(index: WindowConfig) {
  setContext("window", index);
  return index;
}

export function getWindow(): WindowConfig {
  return getContext("window");
}