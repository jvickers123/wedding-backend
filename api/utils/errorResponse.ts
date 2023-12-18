export class ErrorResponse extends Error {
  statusCode;
  constructor(message: string, statusCode: number, code?: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
