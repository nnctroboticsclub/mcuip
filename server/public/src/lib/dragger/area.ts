import { Position } from "./position";

export class Area {
  constructor(private top_: number, private left_: number, private width_: number, private height_: number) { }

  getStyle(): string {
    return `top: ${this.top_}px; left: ${this.left_}px; width: ${this.width_}px; height: ${this.height_}px;`;
  }

  getPosition(): Position {
    return new Position(this.left_, this.top_);
  }

  sizeVector(): Position {
    return new Position(this.width_, this.height_);
  }

  moveTo(pos: Position): Area {
    const { x, y } = pos.components();
    return new Area(y, x, this.width_, this.height_);
  }

  relativeArea(): Area {
    return new Area(0, 0, this.width_, this.height_);
  }

  fitToArea(pos: Position): Position {
    const tl = new Position(this.left_, this.top_);
    const br = new Position(this.left_ + this.width_, this.top_ + this.height_);
    const new_pos = pos.max(tl).min(br);
    console.log(`fitToArea: ${pos.toString()} -> ${new_pos.toString()} (tl: ${tl.toString()}, br: ${br.toString()})`);
    console.log(`-> top: ${this.top_}, left: ${this.left_}, width: ${this.width_}, height: ${this.height_}`)
    return new_pos;
  }

  fitInArea(other: Area): Area | null {
    if (this.width_ > other.width_ || this.height_ > other.height_) {
      return null;
    }

    return other.moveTo(
      this
        .getPosition()
        .subtract(this.sizeVector())
        .min(other.getPosition())
    )
  }
}