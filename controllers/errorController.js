const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    errors: err.errors,
    message: err.message,
  });
};

const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "dev") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "prod") {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      let error = Object.create(err);
      if (error.name === "SequelizeValidationError") {
        error = new AppError(
          "Talabaning tug'ilgan sanasi to'liq kiritilmadi",
          400
        );
      }

      if (error.name === "SequelizeDatabaseError") {
        if (err.original.code === "22P02") {
          error = new AppError("Cast Error", 400);
        }
      }

      if (error.name === "SequelizeUniqueConstraintError") {
        if (err.original.code === "23505") {
          error = new AppError("The row already exists", 400);
        }
      }

      if (error.name === "validationError") {
        error.errors = error.errors.map((er) => er.msg);
      }

      if (error.name === "TokenExpiredError") {
        error = new AppError("Tokeningizning vaqti tugagan", 401);
      }

      sendErrorProd(error, res);
    }
  }
};

module.exports = errorController;
