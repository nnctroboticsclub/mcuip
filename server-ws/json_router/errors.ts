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

export class MalformedDataError extends RouterError {
  constructor(message: string) {
    super(message);
    this.name = "MalformedDataError";
  }
}