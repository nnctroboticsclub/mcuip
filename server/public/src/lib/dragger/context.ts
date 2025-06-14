import { getContext, setContext } from "svelte";
import { writable, type Readable, type Writable, derived, get } from "svelte/store"
import type { Position } from "../ui/position";
import { Area } from "../ui/area";

export class DragTargetContext {
  private pos: Writable<Position>; // Target position

  constructor(pos: Writable<Position>) {
    this.pos = pos;
  }

  updatePos(pos: Position) {
    const { x: x1, y: y1 } = get(this.pos).components();
    const { x: x2, y: y2 } = pos.components();
    if (x1 == x2 && y1 == y2) {
      return;
    }

    this.pos.set(pos);
  }

  getPos(): Writable<Position> {
    return this.pos;
  }

  getStyle(): Readable<string> {
    return derived(this.pos, x => x.getStyle());
  }

  public static setContext(tag: string, pos: Writable<Position>) {
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
  private is_dragging: Writable<boolean> = writable(false);
  private area: Writable<Area>
  private debug: Writable<string> = writable("");

  constructor(top: number, left: number, width: number, height: number) {
    this.area = writable(new Area(top, left, width, height));
  }

  getArea(): Readable<Area> {
    return this.area;
  }

  getDebug(): Writable<string> {
    return this.debug;
  }

  setArea(area: Area) {
    this.area.set(area);
  }

  getIsUnavailable(): Readable<boolean> {
    return this.is_unavailable;
  }

  setDragging(is_dragging: boolean) {
    this.is_dragging.set(is_dragging);
  }

  getDragging(): Readable<boolean> {
    return this.is_dragging;
  }

  static initContext(tag: string) {
    const ctx = new DragContainerContext(0, 0, 0, 0);
    ctx.is_unavailable.set(true);
    setContext("dragContainer-" + tag, ctx);
  }

  static clearContext(tag: string) {
    DragContainerContext.getContext(tag).is_unavailable.set(true);
  }

  static getContext(tag: string): DragContainerContext {
    return getContext<DragContainerContext>("dragContainer-" + tag);
  }
}