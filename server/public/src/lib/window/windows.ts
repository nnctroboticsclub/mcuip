import { writable } from "svelte/store";
import type { WindowConfig } from "./window";

export const windows: WindowConfig[] = [
  {
    top: writable(0),
    left: writable(600),
    width: writable(300),
    height: writable(590),
    app_name: "window_inspector",
    window_data: writable(undefined),
    status: writable("Uninitialized")
  },
  {
    top: writable(600),
    left: writable(0),
    width: writable(900),
    height: writable(300),
    app_name: "console_log",
    window_data: writable(undefined),
    status: writable("Uninitialized")
  },
  {
    top: writable(0),
    left: writable(0),
    width: writable(300),
    height: writable(300),
    app_name: "test",
    window_data: writable(undefined),
    status: writable("Uninitialized")
  },
];