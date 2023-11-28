import { writable, type Writable } from "svelte/store";
import type { WindowConfig } from "./window";
import { getContext, setContext } from "svelte";

export class WindowManagerContext {
  private windows_: Writable<WindowConfig[]> = writable([]);


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

  launch(app_name: string, window_data: Writable<any> = writable({})) {
    console.log(`Launching ${app_name} with data:`, window_data);
    return window;
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