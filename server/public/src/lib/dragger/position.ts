export class Position {
  constructor(private x_: number, private y_: number) { }

  getStyle(): string {
    return `top: ${this.y_}px; left: ${this.x_}px;`;
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
}