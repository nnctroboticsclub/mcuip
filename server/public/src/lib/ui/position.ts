import { Area } from "./area";

export class Position {
  constructor(private x_: number, private y_: number) { }

  getStyle(): string {
    const x_style = this.x_ < 0 ? `right: ${-this.x_}px;` : `left: ${this.x_}px;`;
    const y_style = this.y_ < 0 ? `bottom: ${-this.y_}px;` : `top: ${this.y_}px;`;

    return x_style + y_style;
  }

  subtract(right_operand: Position): Position {
    return new Position(this.x_ - right_operand.x_, this.y_ - right_operand.y_);
  }

  add(right_operand: Position): Position {
    return new Position(this.x_ + right_operand.x_, this.y_ + right_operand.y_);
  }

  max(right_operand: Position): Position {
    return new Position(Math.max(this.x_, right_operand.x_), Math.max(this.y_, right_operand.y_));
  }

  min(right_operand: Position): Position {
    return new Position(Math.min(this.x_, right_operand.x_), Math.min(this.y_, right_operand.y_));
  }

  toArea(width: number, height: number): Area {
    return new Area(this.y_, this.x_, width, height);
  }

  toString(): string {
    return `(${this.x_}, ${this.y_})`;
  }

  components(): { x: number, y: number } {
    return { x: this.x_, y: this.y_ };
  }
}