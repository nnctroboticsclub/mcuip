import { writable, type Writable } from "svelte/store";
import type { WindowConfig } from "./window";
import { getContext, setContext } from "svelte";

export class WindowManagerContext {
  private windows_: Writable<WindowConfig[]> = writable([]);

  constructor() { }

  get windows(): Writable<WindowConfig[]> {
    return this.windows_;
  }

  addWindow(window: WindowConfig) {
    this.windows_.update(windows => {
      windows.push(window);
      return windows;
    });
  }

  removeWindow(tag: string) {
    this.windows_.update(windows => {
      return windows.filter(window => window.tag != tag);
    });
  }


  static getContext(): WindowManagerContext {
    const context = getContext<WindowManagerContext>("windowManager");
    if (context == undefined) {
      return WindowManagerContext.setContext(new WindowManagerContext());
    }
    return context;
  }

  static setContext(context: WindowManagerContext): WindowManagerContext {
    setContext("windowManager", context);
    return context;
  }
}