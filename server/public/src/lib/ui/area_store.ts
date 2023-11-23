import type { Writable } from "svelte/store";
import type { Area } from "./area";
import type { Position } from "./position";
import { DerivedWritable } from "$lib/stores/derived_writable";


export class AreaStore implements Writable<Area> {
  constructor(private area_: Writable<Area>) { }

  subscribe(run: (value: Area) => void, invalidate?: (value?: Area) => void) {
    return this.area_.subscribe(run, invalidate);
  }

  set(value: Area) {
    this.area_.set(value);
  }

  update(fn: (value: Area) => Area) {
    this.area_.update(fn);
  }

  public getPositionStore(): Writable<Position> {
    return new DerivedWritable(this, x => x.getPosition(), (x, y) => x.movedTo(y));
  }

  public getSizeStore(): Writable<Position> {
    return new DerivedWritable(this, x => x.sizeVector(), (x, y) => x.resizedTo(y));
  }
}