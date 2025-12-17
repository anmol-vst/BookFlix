

class errorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware =(err, req, res, next) => {
  err.message = err.message || "internal server error";
  err.statusCode = err.statusCode || 500;
  if (err.code === 11000) {
    const statusCode = 400;
    const message = `Duplicate Field Value Entered`;
    err = new errorHandler(err.message, err.statusCode);
  }
  if (err.name === "JsonWebTokenError") {
    const statusCode = 400;
    const message = `json webtoken is invalid. try again`;
    err = new errorHandler(message, statusCode);
  }
  if (err.name === "TokenExpiredError") {
    const statusCode = 400;
    const message = `json web token is expired. try again`;
    err = new errorHandler(message, statusCode);
  }
  if (err.name === "CastError") {
    const statusCode = 400;
    const message = `Resource not found. Invalid:${err.path}`;
    err = new errorHandler(message, statusCode);
  }
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

// module.exports = errorMiddleware;
// module.exports.default = errorHandler;
