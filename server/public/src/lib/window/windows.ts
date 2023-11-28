import { writable } from "svelte/store";
import { WindowConfig } from "./window";
import { Area } from "$lib/ui/area";

export const windows: WindowConfig[] = [
  new WindowConfig(writable(new Area(0, 300, 300, 590)), "window_inspector", writable(undefined)),
  new WindowConfig(writable(new Area(600, 0, 600, 300)), "console_log", writable(undefined)),
  new WindowConfig(writable(new Area(0, 0, 300, 300)), "test", writable(undefined)),
  new WindowConfig(writable(new Area(0, 600, 300, 900)), "debugger", writable(undefined)),
];