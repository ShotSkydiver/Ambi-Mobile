class LocalError extends Error {
  constructor(message) {
    super();
    this.status = 400;
    this.message = message;
  }
}

export { LocalError as default };
