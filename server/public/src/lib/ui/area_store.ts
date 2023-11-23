import type { Writable } from "svelte/store";
import type { Area } from "./area";
import type { Position } from "./position";

export class PositionStoreFromArea implements Writable<Position> {
  constructor(private area_: Writable<Area>) { }

  subscribe(fn: (value: Position) => void, invalidate?: (value?: Position) => void) {
    const wrapped_subscriber = (area: Area) => {
      fn(area.getPosition());
    };

    const wrapped_invalidate = !invalidate ? undefined : (area?: Area) => {
      invalidate(area?.getPosition());
    }

    return this.area_.subscribe(wrapped_subscriber, wrapped_invalidate);
  }

  set(value: Position) {
    this.area_.update(x => {
      return x.moveTo(value);
    });
  }

  update(fn: (value: Position) => Position) {
    this.area_.update(x => {
      const new_position = fn(x.getPosition());
      return x.moveTo(new_position);
    });
  }
}

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
    return new PositionStoreFromArea(this);
  }
}