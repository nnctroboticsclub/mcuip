import { derived, writable, type Readable, type Writable } from "svelte/store";
import { WindowConfig, type DataStore } from "./window";
import { getContext, setContext } from "svelte";
import { Area } from "$lib/ui/area";

class WindowPositionCalculator {
  private i = 0;
  constructor() { }

  GeneratePosition() {
    const x = 10 + 20 * this.i;
    const y = 10 + 20 * this.i;
    this.i++;
    return { x, y };

  }
}

export class WindowManagerContext {
  private position_calculator: WindowPositionCalculator;

  private windows_: WindowConfig[] = [];
  private windows_count_: Writable<number> = writable(0);

  constructor() {
    this.position_calculator = new WindowPositionCalculator();
  }

  getWindowsStore(): Readable<WindowConfig[]> {
    return derived(this.windows_count_, () => this.windows_);
  }

  get windows(): WindowConfig[] {
    return this.windows_;
  }

  addWindow(window: WindowConfig) {
    this.windows_.push(window);
    this.windows_count_.update(x => x + 1);
  }

  removeWindow(tag: string) {
    this.windows_ = this.windows_.filter(x => x.tag != tag);
    this.windows_count_.update(x => x - 1);
  }


  launch(app_name: string, window_data: DataStore = {}) {
    const { x, y } = this.position_calculator.GeneratePosition();
    const area = new Area(x, y, 400, 400);
    console.log("launching window");
    console.log(`  - app_name: ${app_name}`);
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