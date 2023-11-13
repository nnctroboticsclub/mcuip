import { getContext, setContext } from "svelte";
import type { Writable } from "svelte/store";

export type WindowConfig = {
  top: Writable<number>;
  left: Writable<number>;
  width: Writable<number>;
  height: Writable<number>;
  app: Writable<{
    name: string;
    data: any;
  }>;
};

export function setWindowIndex(index: number) {
  setContext("window-index", index);
  return index;
}

export function getWindowIndex(): number {
  return getContext("window-index") as number;
}