class Error {
  constructor (code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequest (msg) {
    return new Error(400, msg);
  }

  static notFound (msg) {
    return new Error(404, msg);
  }

  static conflict (msg) {
    return new Error(409, msg);
  }

  static internal (msg) {
    return new Error(500, msg);
  }
}

module.exports = Error;
