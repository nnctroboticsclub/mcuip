import { writable } from "svelte/store";
import type { WindowConfig } from "./window";

export const windows: WindowConfig[] = [
  {
    top: writable(0), left: writable(600), width: writable(300), height: writable(600), app: writable({
      name: "window_inspector",
      data: {}
    })
  },
  {
    top: writable(600), left: writable(0), width: writable(900), height: writable(300), app: writable({
      name: "console_log",
      data: {}
    })
  },
  {
    top: writable(0), left: writable(0), width: writable(300), height: writable(300), app: writable({
      name: "test",
      data: {}
    })
  },
];