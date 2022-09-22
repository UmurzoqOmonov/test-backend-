const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHaeder = req.headers.authorization;

  if (!authHaeder) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHaeder.slice(7);
  const user = jwt.verify(token, process.env.JWT_SECRET);
  req.user = user;
  next();
};
