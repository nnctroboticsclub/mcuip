import { Position } from "./position";
import { terminal } from "virtual:terminal";

export class Area {
  constructor(private top_: number, private left_: number, private width_: number, private height_: number) { }

  getWidth(): number {
    return this.width_;
  }

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
    if (this.width_ < other.width_ || this.height_ < other.height_) {
      return null;
    }

    const upper_boundary = this.sizeVector()
      .subtract(other.sizeVector());

    const lower_boundary = new Position(0, 0);

    return other.moveTo(
      other.getPosition()
        .max(lower_boundary)
        .min(upper_boundary)
    )
  }

  smaller(x: number, y: number): Area {
    return new Area(this.top_ + x, this.left_ + x, this.width_ - 2 * x, this.height_ - 2 * y);
  }

  toString(): string {
    return `{(${this.top_}, ${this.left_}) + (${this.width_}, ${this.height_})}`;
  }
}