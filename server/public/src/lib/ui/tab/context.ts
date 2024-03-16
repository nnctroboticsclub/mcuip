import { getWindow } from "$lib/window/window";
import { getContext, setContext } from "svelte";
import type { Writable } from "svelte/store";


export class TabContext {
  tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  get active_tab_name(): Writable<string> {
    return getWindow().getDataStore(`tab-${this.tag}-active-tab`);
  }

  get tab_names(): Writable<string[]> {
    return getWindow().getDataStore(`tab-${this.tag}-names`);
  }

  get tab_bar_collapsed(): Writable<boolean> {
    return getWindow().getDataStore(`tab-${this.tag}-collapsed`);
  }

  get tab_bar_mode_deactivate_node(): Writable<boolean> {
    return getWindow().getDataStore(`tab-${this.tag}-mode-deactivate-node`);
  }

  static getContext(): TabContext | null {
    const ctx = getContext<TabContext>("tab_context");
    if (!ctx) {
      return null;
    }
    return ctx;
  }

  static setContext(tag: string) {
    const new_ctx = new TabContext(tag);
    setContext("tab_context", new_ctx);
    return new_ctx;
  }
}