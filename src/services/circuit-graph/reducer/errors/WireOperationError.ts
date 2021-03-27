export class WireOperationError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
