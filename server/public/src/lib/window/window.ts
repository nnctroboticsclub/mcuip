import type { Area } from "$lib/ui/area";
import { AreaStore } from "$lib/ui/area_store";
import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

export type WindowStatus = "Uninitialized" | "Closing" | "Loaded";

export class WindowConfig {
  private area_: AreaStore;
  private app_name_: string;
  private window_data_: Writable<any>;
  private status_: Writable<WindowStatus> = writable("Uninitialized");
  private tag_: string = "window";
  private z_index_: number = 0;

  constructor(area: Writable<Area>, app_name: string, window_data: Writable<any>) {
    this.area_ = new AreaStore(area);
    this.app_name_ = app_name;
    this.window_data_ = window_data;
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

  get window_data(): Writable<any> {
    return this.window_data_;
  }

  get status(): Writable<WindowStatus> {
    return this.status_;
  }

  get tag(): string {
    return this.tag_;
  }

  get z_index(): number {
    return this.z_index_;
  }

  set z_index(z_index: number) {
    this.z_index_ = z_index;
  }
};

export function setWindow(index: WindowConfig) {
  setContext("window", index);
  return index;
}

export function getWindow(): WindowConfig {
  return getContext("window");
}