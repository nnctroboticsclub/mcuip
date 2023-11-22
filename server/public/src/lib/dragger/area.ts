import { Position } from "./position";

export class Area {
  constructor(private top_: number, private left_: number, private width_: number, private height_: number) { }

  getStyle(): string {
    return `top: ${this.top_}px; left: ${this.left_}px; width: ${this.width_}px; height: ${this.height_}px;`;
  }

  fitToArea(pos: Position): Position {
    const tl = new Position(this.left_, this.top_);
    const br = new Position(this.left_ + this.width_, this.top_ + this.height_);
    return pos.max(tl).min(br);
  }
}