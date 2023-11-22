import { getContext, setContext } from "svelte";
import { get, writable, type Readable, type Writable, derived } from "svelte/store"
import type { Position } from "./position";


export class DragTargetContext {
  private pos: Writable<Position>;

  constructor(pos: Position) {
    this.pos = writable(pos);
  }

  updatePos(pos: Position) {
    this.pos.set(pos);
  }

  getPos(): Writable<Position> {
    return this.pos;
  }

  getStyle(): Readable<string> {
    return derived(this.pos, (pos: Position) => {
      return `top: ${pos.y}px; left: ${pos.x}px;`;
    });
  }

  public static setContext(tag: string, pos: Position) {
    const ctx = new DragTargetContext(pos);
    setContext(`dragTarget/${tag}`, ctx);

    return ctx;
  }

  public static getContext(tag: string): DragTargetContext {
    return getContext<DragTargetContext>(`dragTarget/${tag}`);
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
    return getContext<DragContainerContext>("dragContainer");
  }
}