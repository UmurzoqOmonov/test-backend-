const { Op } = require("sequelize");
const Users = require("../models/User");
const AppError = require("../utils/appError");

module.exports = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError("Bunday foydalanuvchi topilmadi", 404));
  }

  if (user.status === "BLOCKED") {
    return next("Ushbu foydalanuvchi bloklangan", 401);
  }

  next();
};
