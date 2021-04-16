export class TokenParseError extends Error {
  index: number;
  constructor(index: number, message: string) {
    super(message);
    this.index = index;
    this.message = message;
    Object.setPrototypeOf(this, new.target);
  }
}
