import { getContext, setContext } from "svelte";
import { get, writable, type Writable } from "svelte/store"

export class DragItemContext {
  private top: Writable<number>;
  private left: Writable<number>;
  private width: Writable<number>;
  private height: Writable<number>;

  constructor(top: number, left: number, width: number, height: number) {
    this.top = writable(top);
    this.left = writable(left);
    this.width = writable(width);
    this.height = writable(height);
  }
}

export class DragContainerContext {
  private top_: Writable<number>;
  private left_: Writable<number>;
  private width_: Writable<number>;
  private height_: Writable<number>;

  constructor(top: number, left: number, width: number, height: number) {
    this.top_ = writable(top);
    this.left_ = writable(left);
    this.width_ = writable(width);
    this.height_ = writable(height);
  }

  static setContext(top: number, left: number, width: number, height: number) {
    setContext("dragContainer", new DragContainerContext(top, left, width, height));
  }

  static getContext(): DragContainerContext {
    return get(<Writable<DragContainerContext>>getContext("dragContainer"));
  }
}