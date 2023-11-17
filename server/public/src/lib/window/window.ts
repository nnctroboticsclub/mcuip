import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

export type WindowConfig = {
  top: Writable<number>;
  left: Writable<number>;
  width: Writable<number>;
  height: Writable<number>;
  app_name: string;
  window_data: Writable<any>;
};

export function setWindowIndex(index: number) {
  setContext("window-index", index);
  return index;
}

export function getWindowIndex(): number {
  return getContext("window-index") as number;
}


export function setAppData(data: any) {
  let store = writable(data);
  setContext("app-data", store);

  return store;
}

export function getAppData<T>(): Writable<T> {
  return getContext("app-data") as Writable<T>;
}