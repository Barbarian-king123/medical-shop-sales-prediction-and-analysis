module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.error("ERROR:", err);

  if (process.env.NODE_ENV === "production") {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }

  // Development
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};