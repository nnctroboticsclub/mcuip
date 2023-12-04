import { derived, writable, type Readable, type Writable } from "svelte/store";
import { WindowConfig, type DataStore } from "./window";
import { getContext, setContext } from "svelte";
import { Area } from "$lib/ui/area";
import { ZIndexStoreParent } from "./z_index_store";

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

  private z_index_store_parent: ZIndexStoreParent;

  constructor() {
    this.position_calculator = new WindowPositionCalculator();
    this.z_index_store_parent = new ZIndexStoreParent();
  }

  getWindowsStore(): Readable<WindowConfig[]> {
    return derived(this.windows_count_, () => this.windows_);
  }

  get windows(): WindowConfig[] {
    return this.windows_;
  }

  addWindow(pos: Area, app_name: string, window_data: DataStore = {}) {
    const z_index = this.z_index_store_parent.createZIndexStore();
    const window = new WindowConfig(
      writable(pos),
      app_name,
      window_data,
      z_index
    );

    window.status.subscribe(($status) => {
      if ($status === "Closing") {
        this.removeWindow(window.tag);
      }
    })

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

    this.addWindow(area, app_name, window_data);
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