import { getContext, setContext } from "svelte";
import type { Writable } from "svelte/store";

export type WindowConfig = {
  top: Writable<number>;
  left: Writable<number>;
  width: Writable<number>;
  height: Writable<number>;
  app_name: string;
  window_data: Writable<any>;
  status: Writable<string>;
};

export function setWindow(index: WindowConfig) {
  setContext("window", index);
  return index;
}

export function getWindow(): WindowConfig {
  return getContext("window");
}