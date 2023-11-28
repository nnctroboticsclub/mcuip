import { get, writable, type Writable } from "svelte/store";
import { WindowConfig } from "./window";
import { getContext, setContext } from "svelte";
import { Area } from "$lib/ui/area";

class WindowPositionCalculator {
  private i = 0;
  constructor(private windows: Writable<WindowConfig[]>) { }

  GeneratePosition() {
    const x = 10 + 20 * this.i;
    const y = 10 + 20 * this.i;
    this.i++;
    return { x, y };

  }
}

export class WindowManagerContext {
  private position_calculator: WindowPositionCalculator;

  private windows_: Writable<WindowConfig[]> = writable([]);

  constructor() {
    this.position_calculator = new WindowPositionCalculator(this.windows_);
  }

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
    const { x, y } = this.position_calculator.GeneratePosition();
    const area = new Area(x, y, 400, 400);
    console.log("launching window");
    console.log(`  - app_name: ${app_name}`);
    console.log(`  - window_data: ${get(window_data)}`);
    console.log(`  - area: ${area}`);
    const window = new WindowConfig(
      writable(area),
      app_name,
      window_data
    );
    this.addWindow(window);
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