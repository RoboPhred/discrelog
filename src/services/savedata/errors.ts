export class SaveFormatError extends Error {
  code: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.code = "SAVE_FORMAT_ERROR";
  }
}
