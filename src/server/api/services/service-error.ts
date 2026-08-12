export class ServiceError extends Error {
  constructor(
    message: string,
    public code:
      | "NOT_FOUND"
      | "BAD_REQUEST"
      | "FORBIDDEN"
      | "INTERNAL_SERVER_ERROR"
      | "UNAUTHORIZED",
  ) {
    super(message);
    this.name = "ServiceError";
  }
}
