export class RouterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RouterError";
  }
}

export class RouteNotFoundError extends RouterError {
  constructor(message: string) {
    super(message);
    this.name = "RouteNotFoundError";
  }
}

export class InternalError extends RouterError {
  constructor(message: string) {
    super(message);
    this.name = "InternalError";
  }
}

export class KeyNotFoundError extends RouterError {
  constructor(message: string) {
    super(message);
    this.name = "KeyNotFoundError";
  }
}

export class KeyTypeError extends RouterError {
  constructor(message: string) {
    super(message);
    this.name = "KeyTypeError";
  }
}