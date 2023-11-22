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
  private area: Writable<Area>

  constructor(top: number, left: number, width: number, height: number) {
    this.area = writable(new Area(top, left, width, height));
  }



  static setContext(top: number, left: number, width: number, height: number) {
    setContext("dragContainer", new DragContainerContext(top, left, width, height));
  }

  static getContext(): DragContainerContext {
    return getContext<DragContainerContext>("dragContainer");
  }
}