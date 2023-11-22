import { getContext, setContext } from "svelte";
import { writable, type Readable, type Writable, derived } from "svelte/store"
import type { Position } from "./position";
import { Area } from "./area";


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
    return derived(this.pos, x => x.getStyle());
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
  private is_unavailable: Writable<boolean> = writable(false);
  private area: Writable<Area>

  constructor(top: number, left: number, width: number, height: number) {
    this.area = writable(new Area(top, left, width, height));
  }

  fitToArea(pos: Position): Readable<Position> {
    return derived(this.area, x => x.fitToArea(pos));
  }

  subscribeArea(fn: (value: Area) => void) {
    return this.area.subscribe(fn);
  }

  setArea(area: Area) {
    this.area.set(area);
  }

  getIsUnavailable(): Readable<boolean> {
    return this.is_unavailable;
  }

  static initContext() {
    const ctx = new DragContainerContext(0, 0, 0, 0);
    ctx.is_unavailable.set(true);
    setContext("dragContainer", ctx);
  }

  static clearContext() {
    DragContainerContext.getContext().is_unavailable.set(true);
  }

  static getContext(): DragContainerContext {
    return getContext<DragContainerContext>("dragContainer");
  }
}